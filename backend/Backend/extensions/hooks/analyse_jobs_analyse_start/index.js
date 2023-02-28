const { spawn } = require('node:child_process');

/**
const pwd = spawn('pwd');
pwd.stdout.on('data', (data) => {
    console.log(`pwd: ${data}`);
});
 */

const customFiles = "/directus/CustomFiles";
const baseProcessFolder = customFiles+"/"+"Repo_temp";

const TABLE_ANALYSE_JOBS = "analyse_jobs"

async function cmd(command, params, onData, customOnError, cwd) {
    let options = {};
    if (cwd) {
        options.cwd = cwd;
    }
    console.log("cmd: " + command + " " + params.join(" "));
    if(!params){
        params = []
    }
    let p = spawn(command, params, options);
    return new Promise((resolveFunc, rejectFunc) => {
        p.stdout.on("data", (x) => {
             console.log("CMD onData: "+x.toString());
            //process.stdout.write(x.toString());
            if(onData){
                onData(x);
            }
        });
        p.stderr.on("data", (x) => {
            console.log("Error");
            console.log(x.toString());
            if(customOnError){
                customOnError(x);
            } else {
                //process.stderr.write(x.toString());
                rejectFunc(x.toString());
            }
        });
        p.on("exit", (code) => {
            console.log("Exit");
            resolveFunc(code);
        });
    });
}

function getJobTempFolder(job_id){
    return baseProcessFolder+"/"+job_id
}

function getDownloadedRepoFolder(job_id){
    const temp_folder = getJobTempFolder(job_id)
    let repo_download_path = temp_folder+"/"+"myRepo"
    return repo_download_path;
}

async function shouldStartAnalyse(payload){
    return payload?.analyse_state==="start";
}

async function getAllGitCommits(job_id){
    let repo_download_path = getDownloadedRepoFolder(job_id);

    let seperator = ":::";
    let bufferOutput = null
    await cmd('git', ["log", '--pretty=format:"%h'+seperator+'%an'+seperator+'%ae'+seperator+'%ad'+seperator+'%s"', "--date=iso"], (data) => {
        console.log("getAllGitCommits")
        console.log(data);
        bufferOutput = data;
    }, null, repo_download_path);
    try{
        if(!bufferOutput){
            return "Error, no buffer output";
        } else {
            const output = bufferOutput.toString('utf-8');
            return output;
        }
    } catch (err){
        return "Error, could not get the commits: "+err.toString()
    }
}

async function runScan(job_id){
    console.log("runScan");
    const repo_download_path = getDownloadedRepoFolder(job_id);
    await cmd('/directus/sonar-scanner', ["-Dsonar.projectKey=my-project", '-Dsonar.sources='+repo_download_path], (data) => {
        console.log("runScan data")
        console.log(data);
    }, null, repo_download_path)
}

async function handleCheckAllCommits(job_id, payload, context, database){
    console.log("handleCheckAllCommits");

    let gitCommits = await getAllGitCommits(job_id);
    await updateProgress(database, job_id, gitCommits);
    try{
        runScan(job_id);
    } catch (err){
        console.log(err);
    }

    await database(TABLE_ANALYSE_JOBS).where({id: job_id}).update({
        analyse_state: "finished"
    });
}

function getJobIdFromInput(input){
    if(input?.key!==undefined){
        return input?.key;
    }
    return input?.keys[0];
}

async function updateProgress(database, job_id, text){
    console.log("updateProgress");
    console.log(" - "+job_id);
    console.log(" - "+text);
    await database(TABLE_ANALYSE_JOBS).where({id: job_id}).update({
        progress: text
    });
}

async function checkIfStartAnalyse(input, context, database) {
    const job_id = getJobIdFromInput(input);

    const payload = input?.payload;

    const shouldStartAnalyseValue = await shouldStartAnalyse(payload);
    if(shouldStartAnalyse){
        await database(TABLE_ANALYSE_JOBS).where({id: job_id}).update({
            analyse_state: "running"
        });
        await updateProgress(database, job_id, "shouldStartAnalyse: "+shouldStartAnalyseValue);
        await handleCheckAllCommits(job_id, payload, context, database);
        return;
    }
}

async function checkIfStartAnalyseOnUpdate(input, context, database) {
    return await checkIfStartAnalyse(input, context, database)
}

async function registerHooks({filter, action, init, schedule}, {
    services,
    exceptions,
    database,
    getSchema,
    logger
}){
    let fullSchema = await getSchema();

    action(
        TABLE_ANALYSE_JOBS + '.items.update',
        async (input, context) => {
            await checkIfStartAnalyseOnUpdate(input, context, database);
        }
    );

}

module.exports = registerHooks.bind(null);
