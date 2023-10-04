


let AllPagesObject = [
    {
      name: "الاختبارات",
      link: "./dashboard.html",
      iconClass: "fa-solid fa-newspaper",
      iconStyle: "color: black;",
    }
];
    
    
    
    let bg=`background-image: radial-gradient(circle at top right, rgb(78, 78, 78) 0%, rgb(78, 78, 78) 1%,rgb(72, 72, 72) 1%, rgb(72, 72, 72) 10%,rgb(65, 65, 65) 10%, rgb(65, 65, 65) 22%,rgb(59, 59, 59) 22%, rgb(59, 59, 59) 23%,rgb(53, 53, 53) 23%, rgb(53, 53, 53) 28%,rgb(46, 46, 46) 28%, rgb(46, 46, 46) 37%,rgb(40, 40, 40) 37%, rgb(40, 40, 40) 100%);`
      
    document.querySelector(".AllPagesBtns").innerHTML=""
    AllPagesObject.forEach(e=>{
      document.querySelector(".AllPagesBtns").innerHTML+=`
          
          <a class="active d-flex align-center fs-14 c-black rad-6 p-10" style="${(`.${location.pathname}`==`${e.link}`)?`${bg} color: white;`:"background: white;"};display: flex; justify-content: end;" href="${e.link}">
            <span style="font-weight: bold; font-size:20px;">${e.name}</span>
            <i class="${e.iconClass}" style="${(`.${location.pathname}`==`${e.link}`)?`color: white;`:`${e.iconStyle}`}  font-weight: bold; font-size:20px; margin-left: 10px;"></i>
          </a>
          
      `
    });
    
    
    
    
    
    
    document.querySelector("body > div > div.content.w-full > div.head.bg-white.between-flex").innerHTML+=`
    
    <button class="HiddeLeftPar" style="min-width: 100px;
    font-size: 18px;
    font-family: cairo;
    cursor: pointer;
    width: 120px;
    margin: 20px;
    border-radius: 10px;
    background-image: radial-gradient(circle at top right, rgb(78, 78, 78) 0%, rgb(78, 78, 78) 1%,rgb(72, 72, 72) 1%, rgb(72, 72, 72) 10%,rgb(65, 65, 65) 10%, rgb(65, 65, 65) 22%,rgb(59, 59, 59) 22%, rgb(59, 59, 59) 23%,rgb(53, 53, 53) 23%, rgb(53, 53, 53) 28%,rgb(46, 46, 46) 28%, rgb(46, 46, 46) 37%,rgb(40, 40, 40) 37%, rgb(40, 40, 40) 100%);
    color: white;
    padding: 5px 0px;
    font-weight: 600;
    border: none;">
    <i class="fa-solid fa-eye"></i>
    </button>
    
    `;
    
    document.querySelector(".HiddeLeftPar").addEventListener("click",(e)=>{
    
      let x = document.querySelector(".sidebar");
      
      if(x.style.display!=="none"){
        x.style.display="none";
        document.querySelector(".HiddeLeftPar").innerHTML=`<i class="fa-solid fa-eye-slash"></i>`
      } else{
        x.style.display="block";
        document.querySelector(".HiddeLeftPar").innerHTML=`<i class="fa-solid fa-eye"></i>`;
      }
      
    })
    
      
    
    
    
    
    document.querySelector("#logOut-digital").addEventListener("click",()=>{
    
      localStorage.setItem("pubg-store-doc-id","");
      location.href="./login/login.html";
    
    });
    
    
    
    
    
    
    
    
    
    