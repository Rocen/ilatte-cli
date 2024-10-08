import axios from "axios";

axios.interceptors.response.use(res => {
    return res.data;
})

async function getRepoList() {
    return axios.get('https://api.github.com/orgs/ilatte-cli/repos')
}

async function  getTagList(repo) {
    return axios.get(`https://api.github.com/repos/ilatte-cli/${repo}/tags`)
}

export {
    getTagList,
    getRepoList
}