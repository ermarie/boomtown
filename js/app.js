
const URL = 'https://api.github.com/orgs/BoomTownROI'

let createdAt
let updatedAt
let publicRepos
let repoArr

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function getDetails(){
    $('#button').remove()
    fetch(URL)
    .then(response => response.json())
    .then(topLevelDetails => {
        for (var key in topLevelDetails) {
            if (topLevelDetails.hasOwnProperty(key)) {
                let val = topLevelDetails[key]
                if ((typeof val === 'string' || val instanceof String) && val.includes(URL)){
                    fetchUrl(val)
                }
            }
        }
        verify(topLevelDetails)
    })
}

function fetchUrl(url) {
    fetch(url)
    .then(handleErrors)
    .then(response => response.json())
    .then(details => {
        let name = url.replace(`${URL}/`, '')
        $('#details').append(`<div><b>${name}</b></div>`)
        for (var key in details) {
            if (details.hasOwnProperty(key)) {
                let hash = details[key]
                for (var key in hash) {
                    if (hash.hasOwnProperty(key)) {
                        if (key === 'id') {
                            $('#details').append(`<div><b>id:</b>${hash[key]}</div>`)
                        }
                    }
                }
            }
        }
    })
    .catch((error) => {
        $('#errors').append(`<div><b>${error}:</b> ${url}</div>`)
    })
}

function verify(details) {

    for (var key in details) {
        if (details.hasOwnProperty(key)) {
            if (key === 'created_at') {
                createdAt = details[key]
            }
            if (key === 'updated_at') {
                updatedAt = details[key]
            }
            if (key === 'public_repos') {
                publicRepos = details[key]
                $('#repo1').append(`<b>${publicRepos}</b>`)
            }
            if (key === 'repos_url') {
                fetch(`${details[key]}?per_page=100`)
                .then(handleErrors)
                .then(response => response.json())
                .then(repos => {
                    repoArr = repos.length
                    $('#repo2').append(`<b>${repoArr}</b>`)
                    if (publicRepos === repoArr) {
                        $('#repos').append(`<b>Verfied</b>`)
                    }
                })
            }
        }
    }

    let createDate = new Date(createdAt)
    let upDate = new Date(updatedAt)
    if (upDate > createDate) {
        $('#dates').append('<b>Verified</b>')
    }

}