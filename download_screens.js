const fs = require('fs');
const https = require('https');
const path = require('path');

const screens = [
  {"id": "2fc831a356a247a09cad27a8b188baad", "title": "Home - Cinematic Mobile", "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQwMDE1YmQ4M2ViZjQxZTg5ZWU4MTZmYTcyMmNjMThiEgsSBxC676W54wMYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUwODUxMTA3NDM4ODM0MTMw&filename=&opi=89354086", "img": "https://lh3.googleusercontent.com/aida/ADBb0uje4Ujg1y27wJOtNBOw347oydI5HVyNzE-pn1vX4NtVIe6SJK585ObmFG0U57Zr9U5vA2Uymqg41xRGcqG_-KV-S-agz3pqGXkHJ6IBOE-6-fgU0Mwk40lRbiCmCbB55ESrTqSBY8ebXzxMlmUE1wfVNkjS6QXKTllm6vonRX9HQRde2XrwD8WIGjnKpXi62f_F8e4mqoGqrzLv5-dHgvqV3Rk_5uDMHMDdDP-5Ejjloc5HbdrB6wltg9w"},
  {"id": "7dd71ccad4b845dfb21d3068b5cbba50", "title": "Terms & Privacy Desktop", "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzIwNDYwZjA0ZmE5ODQxOTM4ODEyOTA4NjE3MzAwYjZhEgsSBxC676W54wMYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUwODUxMTA3NDM4ODM0MTMw&filename=&opi=89354086", "img": "https://lh3.googleusercontent.com/aida/ADBb0ugnVHhFon1VgJDEfh7ANgAR9ATs1hTlaZELBNs6lehmeUNmRyrzii-7otbjz0LZ8VrDyHeRpSs1aB3XbZSo5RBDk-Q8xiWnmVibcclNFLITiJHSBuqIKwqDHjDUuqNcdtDmDFgZpVmInuJOnIxt2oKDmCBQb2gJtqRKrGIAemk9cC4hFE9wiq9hknRdH68MBApABLRMAW26tJ7Sr_fv-zpLD4_JKlII76Z29GrL6gJeOCmghSyaAIwZBgs"},
  {"id": "87e005ee343041d1a4ad70d6e2634908", "title": "Admin Panel", "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzUzYmQzZTI1MzkwYzQ4OWU5OGMwODEyNWE4ODdjNzhmEgsSBxC676W54wMYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUwODUxMTA3NDM4ODM0MTMw&filename=&opi=89354086", "img": "https://lh3.googleusercontent.com/aida/ADBb0ujHrL6qzLmiX87jtiljEMryd3ugo-KdTxotqCz7ilAjnVzSs7l6In24ccvYZEs5JDI6pb_9hvr8jhpB9kRjYi0jopUVMumRvNoZ5ifvTK-aqNwWAzzaO4a-mAaCi2NAKOr3Vs_-DI41YlNavPcUrwm_SEjjzjT-jWFr5PxSc1YdK-7Jb3pdFyCxBm4CHHGmVQBdKAOtj99LXxDILaOCMQJNxWQZvzDhEw6bY2a1JxyfKHMXSSf-a_cQYdY"},
  {"id": "d206d0995c3548f2aa2dccdc227f187c", "title": "Home Cinematic Desktop", "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzhiZGRiN2Y2Yjk0ODQzYTZhOWY3MDg2YzE4ZDM0MjQxEgsSBxC676W54wMYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUwODUxMTA3NDM4ODM0MTMw&filename=&opi=89354086", "img": "https://lh3.googleusercontent.com/aida/ADBb0uhwlyiqvSO5uMyRVc1B-dIf6PkGiyr-RBzRt2Wjy4zAtCHmd0MuIdCdsIA_cq9PhnWJ3PZNITpkoxxeO2dUfRh5zgG_P9mZLY69xazyXgtodpxN0ofSlKDGcPl-zrKWA8Qyy-TqjoTsaUXkSwbXdoR4qvjucPRNBXl8J55BMvDiYfTfau6AsBWvZQ8RyOQvNRQBpslmXO60yI2LpM_LrfAfFoVd7YZ3k82q0RozLdvlFCifuvvnfjzorGI"},
  {"id": "eeb6f344b53b4368b87d192328e60c79", "title": "Login Register", "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2UzNGIzYzYyOGYxNjQwNmU5MDcxOGYwYjJmOWM3OWYzEgsSBxC676W54wMYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUwODUxMTA3NDM4ODM0MTMw&filename=&opi=89354086", "img": "https://lh3.googleusercontent.com/aida/ADBb0uho8EDhRtDPulRLlYIdYzr8xD5i9l0g4LRKMCv_ABnpYNGRnPdfTfZs6LN3-8fqhJYfNoGG9AFTxGL_9cu4WeexrVBChDGn-tQBuvhSFBrQ3stZJT4vjVvEzrBDuEOq3AxdUvRcxNIkwqYNwzSiYeVbdlFFP6AS-mhAx6gDT3aoxjk02EdouUK2BCTnkMZqb05pMYGUq-wHpMFGaKONBhMRw_PPPIoA4z0rlvS1JGRtTUZUG7fLFFLV6gE"},
  {"id": "fbb517c09822453a85c51dc5352ddd26", "title": "Dashboard Analytical", "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzE1N2UyNjJiY2MwMzQ4MGJhODAyZDJhZjhjMmIyZWU5EgsSBxC676W54wMYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUwODUxMTA3NDM4ODM0MTMw&filename=&opi=89354086", "img": "https://lh3.googleusercontent.com/aida/ADBb0ujxZl2QfsY6ZVvv6lO4XzV-rIT6iMn4aDjhJIwXm8us8t3hnKf-FVyTyHkjkrMjubYIRAf9RmOzEtV2jn8e1-jtc1AtyYkaHlvI7b0S-lwmAMyUwyAa0CIgkxJg_hVoSs29_DwXTdsEHklnJWYj7WLVOli2zta02tEuHDTJjl8muoEqWTXd6lpBg8BzyXzD293VWV_xuFhiGaa_o8Y7cjwuqytNibec5zxPo01jZnYOBBcDPBXo77G4B8k"},
  {"id": "2684f5e93ee149f6870014eab9e2e77b", "title": "Dashboard Glass", "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ExZjY5MjNmNGJiYjRjMDViZGJiYmQ5OWRmZTdhZmYwEgsSBxC676W54wMYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUwODUxMTA3NDM4ODM0MTMw&filename=&opi=89354086", "img": "https://lh3.googleusercontent.com/aida/ADBb0ugvUuClqB85N9zLhvAoqCoQ2YMCq5piVuc9RI_YqwE_jnkWfvP2gQ_-SL55TrOwKA8ZZ5PdvqNrZkwMW6RMfraK_ALO80rKwXy_ObARBNMxUMWWl6rxUyPrZCOO8Gh67FfMQq5TcSOxpLTtXtC5BEelI5mx0lu8St8BikKz-55Ow8sTedKhxv3x5Rwyq_r3qMYEcBeC3qBUgLMYE3vvJPO2TiqVkgb4t283UzWGybC0nQ9vMtnSOvS5DWU"},
  {"id": "dc4a7063d732486889db1886fca6facf", "title": "Dashboard Fluid", "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzE4MzdhZTJhNGZkNjQ5MjI5ODY0ZDlmNmIyOTYzMmY2EgsSBxC676W54wMYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUwODUxMTA3NDM4ODM0MTMw&filename=&opi=89354086", "img": "https://lh3.googleusercontent.com/aida/ADBb0uhu8ecx8pux1FHTJUpjuhJ_OTWLqvw8TFsRPVIIORrK-tfK4hegDQhfmtsrSz7z8sIGmsB2LboKwXKJbeh8P-Vrsp05y3hVvFG8LB_Yt6O4SDlfiwjuMwpkzs8tJr-kLyLtlahSfZOEjf6O9nJ6EIQsVhVU2valrghZnsEtZFwRRlgEKpzE6q4NENTIoz029ZImSpZZNFSKHoHkiXGZriIm2s7Rx-O2sFQ7dNH3WQQ748J45JBt0m7noSU"}
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url) return resolve();
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const baseDir = path.join(__dirname, 'stitch_screens_final');
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

  for (const s of screens) {
    if (s.html) {
      const p = path.join(baseDir, s.title + '.html');
      console.log('Downloading', p);
      await download(s.html, p);
    }
    if (s.img) {
      const p = path.join(baseDir, s.title + '.png');
      console.log('Downloading', p);
      await download(s.img, p);
    }
  }
}
run();
