const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";

const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const CONTAINER = document.getElementById("cantainer");

const PAGINATION = document.getElementById("pagination")

const SEARCHMOVIE = document.getElementById("Searchmovie").firstElementChild;

const REFRESH = document.getElementById("profile").lastElementChild;

async function fetchapi(api) {
    const response = await fetch(api);
    const data = await response.json();
    return data;
}

async function fetchData(data) {

    CONTAINER.innerHTML = "";

  
    if (data.results.length===0) {
        CONTAINER.innerHTML="movienotfound"
    }

    data.results.forEach(movie => {
        const FLIPCARD = document.createElement("div")
        FLIPCARD.classList.add("flip-card")

        FLIPCARD.innerHTML += `
        <div class="item">

        <div class="movie">
            <div class="movieimage">
                <img src = ${movie.poster_path != null ? IMGPATH + movie.poster_path : '/img/movie-poster.jpg'} alt="">
            </div>
            <div class="movieimagename">
                <h2>${movie.title != null ? movie.title:"null"}</h2>
            </div>
        </div>
        <div class="overlay">
            <div>
                <div class="moviesname">
                    <h2>${movie.title != null ? movie.title:"null"}</h2>
                    <p>${movie.release_date != null ? movie.release_date:"null"}</p>
                </div>
                <div class="moviesrating">
                    <div class="ratingicon">
                        <i class="fa-solid fa-star"></i>
                        <span>${movie.vote_average != null? movie.vote_average.toFixed(1):"0.0"}</span>
                    </div>
                    <div class="overview">
                        <div class="rating">
                            <span>Rating</span>
                            <p>${movie.vote_average != null? movie.vote_average.toFixed(1):"0.0"} / 10 from ${movie.vote_count !=null ? movie.vote_count: "0" } users</p>
                        </div>
                    </div>
                </div>
                <div class="Storyline">
                    <p>${movie.overview != null ?movie.overview:"null" }</p>
                </div>
                <div class="moviesactor">
                    <div>
                        <span>Director:</span>
                        <p>Patrick Wilson</p>
                    </div>
                    <div>
                        <span>Actors</span>
                        <p>Ty Simpkins, Patrick Wilson, Rose Byrne, Lin Shaye</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `

        CONTAINER.appendChild(FLIPCARD);

        FLIPCARD.addEventListener("click", (event)=>{
            event.currentTarget.firstElementChild.style.transform = "rotateY(180deg)"
        })

        FLIPCARD.addEventListener("mouseleave", (event)=>{
            event.currentTarget.firstElementChild.style.transform = "none"
        })

    })
}

function pagination(data) {
    
    const LISTS=PAGINATION.querySelector("#list");
    LISTS.innerHTML="";

    nextprevious(data);

    for(let index = 1; index<= `${data.total_pages > 500 ? 500 : data.total_pages}`; index++){
        const li = document.createElement("li");
        li.innerHTML = index;
        li.addEventListener("click", async (e)=>{
            const SEARCHINPUTS = SEARCHMOVIE.value;

            PAGINATION.querySelector(".active").classList.remove("active")
            e.target.classList.add("active");
            if (SEARCHINPUTS== ""){
                const data = await fetchapi(`${APIURL}${e.target.innerHTML}`);
                fetchData(data);
                nextprevious(data);
                // for(let i=0 ;i<`${data.total_pages>500 ? 500:data.total_pages}`;i++){
                //     LISTS.children[i].classList.remove("active");
                // }
            }else{
                const data = await fetchapi(`${SEARCHAPI}${SEARCHINPUTS}&page=${e.target.innerHTML}`);
                fetchData(data);
                nextprevious(data);
                // for(let i=0;i<`${data.total_pages > 500 ? 500 : data.total_pages}`; i++){
                //     LISTS.children[i].classList.remove("active")
                // }
            }
        })
        LISTS.appendChild(li);
    }
    LISTS.children[0].classList.add("active");

}

function nextprevious(data) {
    
    if (data.page > 1 ){
        PAGINATION.querySelector("#prev").style.visibility="visible";
    }else{
        PAGINATION.querySelector("#prev").style.visibility="hidden";
    }

    if (data.page<`${data.total_pages > 500 ? 500 : data.total_pages}`){
        PAGINATION.querySelector("#next").style.visibility="visible";
    }else{
        PAGINATION.querySelector("#next").style.visibility="hidden";
    }


}

PAGINATION.querySelector("#prev").addEventListener("click",()=>{
    PAGINATION.querySelector(".active").previousElementSibling.click();
})

PAGINATION.querySelector("#next").addEventListener("click",()=>{
    PAGINATION.querySelector(".active").nextElementSibling.click();
})

async function homepage(page = 1){
    const data = await fetchapi(`${APIURL}${page}`);
    console.log(data)
    fetchData(data);
    pagination(data)
}

homepage();


SEARCHMOVIE.addEventListener("keyup", async (e) => {
    const SEARCHINPUTS = e.target.value;
    if (e.target.value===""/*||(/^[^a-z0-9]/i).test(e.target.value)*/) {
        // homepage();
        const data = await fetchapi(`${APIURL}${1}`);
        fetchData(data);
    } else {
        const data = await fetchapi(`${SEARCHAPI}${SEARCHINPUTS}&page=${1}`);
        fetchData(data);
        pagination(data);
    }

})

REFRESH.addEventListener ("click",()=>{
    window.location.reload();

})



