


document.getElementById("search-button").addEventListener("click", formValidation)


const hideResults = () => document.getElementById("search-results").style.display = "none"

const errorElem = document.getElementById("error")



function formValidation() {

    event.preventDefault() //Avoid to refresh the form on click

    let searchElem = document.getElementById("search-input")
    let searchInput = searchElem.value = searchElem.value.trim()  //So, no problems with white spaces at the beginning/end of the txt typed.

    if (searchInput.length === 0) {
        hideResults()    //if any previous appears
        errorElem.innerHTML = `<p>Type something, don´t be lazy =)</p>`
        errorElem.style.display = "block"

    } else fetchData(searchInput)
}



const fetchData = async (searchInput) => {
    const spinnerContainer = document.getElementById("spinner-container")
    spinnerContainer.style.visibility = "visible"

    const spinner = document.getElementById("spinner")
    spinner.style.visibility = "visible"

    const userResponse = await fetch(`https://api.github.com/users/${searchInput}`)
    if (userResponse.status === 200) {

        errorElem.style.display = "none"   // if no errors

        const userData = await userResponse.json()


        //if user has repositories, then:
        let reposData = []
        if (userData.public_repos) {
            document.getElementById("no-repos").style.display = "none";
            const reposResponse = await fetch(`https://api.github.com/users/${searchInput}/repos`)
            reposData = await reposResponse.json()
        } else {
            // "no repos" msg is shown:
            document.getElementById("no-repos").style.display = "block";
        }

        buildResultsTable(userData, reposData)
        spinnerContainer.style.visibility = "hidden"
        spinner.style.visibility = "hidden"

    } else {
        // if user doesn't exist:
        hideResults()
        spinnerContainer.style.visibility = "hidden"
        spinner.style.visibility = "hidden"
        switch (userResponse.status) {
            case 404:
                errorElem.innerHTML = `<p>Hey sorry, but this username doesn't exist :/</p>`
                break
            case 403:
                errorElem.innerHTML = `<p>API limit reached, sorry!/</p>`
                break
            default:
                errorElem.innerHTML = `<p>Oops!!! something really weird has happened. Try later :/ </p>`
        }
        // display error
        errorElem.style.display = "block"
    }

}

const buildResultsTable = (userData, reposData) => {


    // User info defragmented:
    const { avatar_url, login, bio, name } = userData;

    document.getElementById("user-image").setAttribute("src", avatar_url);
    document.getElementById("username").innerHTML = `@${login}`;
    document.getElementById("full-name").innerHTML = name;
    document.getElementById("user-bio").innerHTML = bio;

    const reposTable = document.getElementById("repos-table");

    // populate repos table:
    reposTable.innerHTML = "";
    reposData.forEach(repo => {
        const { name, html_url, forks_count, stargazers_count } = repo;
        reposTable.innerHTML += `
              <div>
                <h4><a href=${html_url} target="_blank">${name}</a></h4>
                <div>
                    <img src="assets/images/star.png"> ${stargazers_count}
                    <img src="assets/images/fork.png"> ${forks_count}
                </div>
              </div>`;
    });

    document.getElementById("search-results").style.display = "block";
};

