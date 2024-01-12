import {docName, initializeApp,firebaseConfig ,getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt,endAt } from '../firebase.js';
let docId = await localStorage.getItem(`${docName}`);
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const storage = firebase.storage();
/**/

let X;

async function getCit(db,X) {
  const citiesCol = collection(db,`${X}`);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
};

/* end import from firebase */

let userName =""
let phoneNumber =""

let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let exam = urlParams.get('exam');
let editExam = urlParams.get('editExam');
let examDATA;



function checkQuizAvailability(dateStart,dateEnd) {
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);
  const currentDate = new Date();

  return currentDate >= startDate && currentDate <= endDate;
}


if(exam!==null&&editExam==null){




  let q = query(collection(db, "exams"),where("id","==",`${exam}`), limit(X||1));
  let querySnapshot = await getDocs(q);
  let cityList = querySnapshot.docs.map(doc => doc.data());
  examDATA = cityList;

  // console.log(examDATA)

  /* */
  let startDate = new Date(examDATA[0].dateStart);
  let endDate = new Date(examDATA[0].dateEnd);
  let currentDate = new Date();

  if(currentDate >= startDate && currentDate <= endDate){



    Swal.fire({
      title: '',
      html:`
        
      <bdi style="margin: 5px;font-size: 24px;font-family: cairo;font-weight: bold;">
      اسم الاختبار: ${examDATA[0].examName}
      </bdi>
      
      <br>

      <bdi style="margin: 5px;font-size: 24px;font-family: cairo;font-weight: bold;">
      مدة الاختبار: ${examDATA[0].examTime} ساعة
      </bdi>

      <hr>

      <bdi style="margin: 5px;font-size: 24px;font-family: cairo;font-weight: bold;">
      لدخول الاختبار برجاء كتابة البيانات التالية
      </bdi>

      <hr>
      
      <div class="quiz-info" style="text-align: center; font-family: cairo;  justify-content: center;" dir="auto">

        <div class="category">
          <label for="userName" style="font-weight: bold;">الاسم</label>
          <br>
          <input dir="auto" type="text" id="username">
        </div>

        <div class="category">
          <label for="phoneNumber" style="font-weight: bold;">رقم الهاتف</label>
          <br>
          <input dir="auto" type="number" id="PhoneNumber">
        </div>

      </div>
        
      `,
      showCancelButton: true,
      confirmButtonText:
        '<b>ابدا</b>',
      confirmButtonAriaLabel: 'Thumbs up, great!',
    }).then(async e=>{
      if(e.isConfirmed){
        userName = document.querySelector("#username").value;
        phoneNumber = document.querySelector("#PhoneNumber").value;
        
        if(userName.trim()!==""&&phoneNumber.trim()!==""&&phoneNumber.length==11){

          Swal.fire({
            title: 'Please Wait!',
            didOpen: () => {
              Swal.showLoading()
            }
          });


          let q = query(collection(db,"exams",`${examDATA[0].id}`,`results`),where("phoneNumber","==",`${phoneNumber}`), limit(X||1));
          let snapshot = await getCountFromServer(q);
          
          // let querySnapshot = await getDocs(q);
          // let cityList = querySnapshot.docs.map(doc => doc.data());
          // console.log(cityList);

          if(snapshot.data().count==1){
            Swal.fire("لقد قمت بانهاء هذا الاختبار بالفعل","","error")
          } else if(snapshot.data().count==0){

            Swal.fire(" بالتوفيق  ","","info")

            document.querySelector(".CreateQuizDiv").style.display="none";
            document.querySelector(".quiz-app").style.display="block";

            document.querySelector(".quiz-info").innerHTML=`

            <bdi style="margin: 5px;font-size: 20px;font-family: cairo;font-weight: bold;">
            اسم الاختبار: ${examDATA[0].examName}
            </bdi>
      
            <bdi style="margin: 5px;font-size: 20px;font-family: cairo;font-weight: bold;">
            مدة الاختبار: ${examDATA[0].examTime} ساعة
            </bdi>

            `;
            timer(Number(examDATA[0].examTime));
            
            showAllQuestions(examDATA[0].theExam);
          };
          



          
        } else {
          Swal.fire(`برجاء التاكد من كتابة الاسم ورقم الهاتف بشكل صحيح`,"","error");
        }
       
      };
    })


  } else if(currentDate <= startDate){
    Swal.fire("لم يبدا الاختبار بعد","","error");
  } else if(currentDate >= endDate){
    Swal.fire("انتهي الاختبار ","","error");
  }



  /* */


} else if (exam==null&&editExam!==null&&docId!==null){
  




  let q = query(collection(db, "exams"),where("id","==",`${editExam}`), limit(X||1));
  let querySnapshot = await getDocs(q);
  let cityList = querySnapshot.docs.map(doc => doc.data());
  examDATA = cityList
  
  let data= examDATA[0].theExam;
  console.log(data)
  if(examDATA[0].AdminId==`${docId}`){

    document.querySelector(".CreateQuizDiv").style.display="block";
    document.querySelector(".quiz-app").style.display="none";

    data.forEach(function show(question, index) {
  
        let div=document.createElement("div");
  
        for(let i = 0; i<6; i++){
          div.innerHTML+=`
            <input dir="auto" class="questionChouse" type="text" name="questions[${index}][answers][${i}]" value="${question.answers[i]!==undefined?`${question.answers[i]}`:``}">
          `;
        }
  
  
        let questionDiv = `
  
        <div>
          <div>
  
            <div style="display: flex; justify-content: space-between;">
              <h5 class="questionNumber" style="margin: 20px 0px; font-size: 18px">
                (${index + 1})
              </h5>
              <span>
                <i title="حذف" class="fa-solid fa-trash remove" data-question="${JSON.stringify(question)}" style="font-size: 20px; color: white; background: darkred; border-radius: 50%; padding: 6px 8px; cursor: pointer;"></i>
              </span>
            </div>

            <img src="${question.titleImage||""}" class="questionImg" style="width: 100%; display: ${question.titleImage==""?"none":"block"}; border-radius: 10px;">
  
            <label for="questions[${index}][title]">Question:</label>

            <i class="fa-solid fa-image addImgToQuestion" id="question_${index}" style="color: darkgreen; cursor: pointer; margin: 5px 10px;"></i>

            <input dir="auto" class="questionTitle" type="text" id="questions[${index}][title]" name="questions[${index}][title]" value="${question.title}">
            <br>
            <label for="questions[${index}][title]">Answer:</label>
            <input dir="auto" class="questionRightAnswer" type="text" name="questions[${index}][right_answer]" value="${question.right_answer}">
            
          </div>
          
          <label style="margin: 10px 0px;">Chouses:</label>
          <div style="display: flex; justify-content: center;">
            <div>
              ${div.innerHTML}
            </div>
          </div>
          <hr>
        </div>
        
      
        `;
  
        document.querySelector("#questions").innerHTML+=questionDiv;
    });

  } else{
    Swal.fire("عفولا لا يمكنك تعديل هذا الاختبار لانك لست مالكه","","error")
  }



} else if (exam==null&&editExam!==null&&docId==null){
  location.href="./login/login.html";
};






document.querySelector(".saveQuiz").addEventListener("click",async()=>{




  Swal.fire({
    title: 'Please Wait!',
    didOpen: () => {
      Swal.showLoading()
    }
  });

  let questionTitles = document.getElementsByClassName('questionTitle');
  let questionImages = document.getElementsByClassName('questionImg');
  let rightAnswers = document.getElementsByClassName('questionRightAnswer');
  let answerInputs = document.getElementsByClassName('questionChouse');

  let extractedData = [];

  for (let i = 0; i < questionTitles.length; i++) {
    let title = questionTitles[i].value.trim();
    let rightAnswer = rightAnswers[i].value.trim();
    let titleImage = (questionImages[i].style.display!=="none")?questionImages[i].src:"";
    
    let answers = [];
    for (let j = 0; j < 6; j++) {
      answers.push(answerInputs[i * 6 + j].value.trim());
    }

    let filteredAnswers= answers.filter(item => item.trim()!=="");

    let questionData = {
      title: title,
      titleImage: titleImage,
      right_answer: rightAnswer,
      answers: filteredAnswers
    };

    extractedData.push(questionData);
  };

  let filteredData=[];
  extractedData.forEach(e=>{
    if(e.titleImage==""&&e.title==""){
      
    }else{
      filteredData.push(e);
    }
  });

  console.log(filteredData);

  // let filteredData2 = extractedData.filter(item => item.title.trim()!=="");
  // console.log(filteredData2);
  
  await setDoc(doc(db,"exams",`${examDATA[0].id}`),{
    ...examDATA[0],
    theExam: filteredData,
  }).then(el=>{
    Swal.fire("Done","","success");
  })


});








document.querySelector(".addNewQuestion").addEventListener("click",()=>{

  array.push({
    title: "",
    right_answer: "",
    answers: ["","","",""]
  });

  
  let i = array.length;
  
  
  let html =`
  
    <div>
      <div>
        
        <div style="display: flex; justify-content: space-between;">
          <h5 class="questionNumber" style="margin: 20px 0px; font-size: 18px">
            (${i + 1})
          </h5>
          <span>
            <i title="حذف" class="fa-solid fa-trash remove" data-question="" style="font-size: 20px; color: white; background: darkred; border-radius: 50%; padding: 6px 8px; cursor: pointer;"></i>
          </span>
        </div>

        <img src="#" class="questionImg" style="width: 100%; display: none; border-radius: 10px;">

        <label for="questions[${i}][title]">Question:</label>

        
        <i class="fa-solid fa-image addImgToQuestion" id="question_${i}" style="color: darkgreen; cursor: pointer; margin: 5px 10px;"></i>
        

        <input dir="auto" class="questionTitle" type="text" id="questions[${i}][title]" name="questions[${i}][title]" value="">
        <br>
        <label for="questions[${i}][title]">Answer:</label>
        <input dir="auto" class="questionRightAnswer" type="text" name="questions[${i}][right_answer]" value="">
        
      </div>
      
      <label style="margin: 10px 0px;">Chouses:</label>
      <div style="display: flex; justify-content: center;">
        <div>
          
        <input dir="auto" class="questionChouse" type="text" name="questions[${i}][answers][0]" value="">
      
        <input dir="auto" class="questionChouse" type="text" name="questions[${i}][answers][1]" value="">
      
        <input dir="auto" class="questionChouse" type="text" name="questions[${i}][answers][2]" value="">
      
        <input dir="auto" class="questionChouse" type="text" name="questions[${i}][answers][3]" value="">
      
        <input dir="auto" class="questionChouse" type="text" name="questions[${i}][answers][4]" value="">
      
        <input dir="auto" class="questionChouse" type="text" name="questions[${i}][answers][5]" value="">
      
        </div>
      </div>
      <hr>
    </div>

  `;

  document.querySelector("#questions").insertAdjacentHTML("beforeend", html)


  resetCount()

})






function resetCount(){
  let j = 0;
  
  document.querySelectorAll(".questionNumber").forEach(e=>{
    j++;
    e.textContent=`(${j})`;
  });
}


function getImgLinkFromInput(imgQuestion){
  let inputImg = document.querySelector("#addImgToQuestionInput");

  inputImg.addEventListener("change",async(e)=>{

    console.log("omar");

    Swal.fire({
      title: 'Please Wait!',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    let src="";
    let ref = firebase.storage().ref();
    let file = inputImg.files[0];
    let name = +new Date() + "-" + file.name;
    let metadata = {
      contentType: file.type
    };
  
    let task = ref.child(name).put(file, metadata);
    task
    .then(async snapshot => snapshot.ref.getDownloadURL())
    .then(async url => {
      console.log(url);
      
      imgQuestion.src=`${url||""}`;
      imgQuestion.style.display="block";
      Swal.fire("Done","","success");
    })

  }, { once: true });
  inputImg.click();
}


window.onclick=async(e)=>{
  


  
  if([...e.target.classList].includes("addImgToQuestion")){
    let imgQuestion = e.target.parentNode.parentNode.querySelector(".questionImg");
    console.log(imgQuestion)
    getImgLinkFromInput(imgQuestion);
  }


  if([...e.target.classList].includes("remove")){

    Swal.fire({
      title: `Remove It ?`,
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
      }).then((result) => {

        if(result.isConfirmed) {

          let divToRemove = e.target.parentNode.parentNode.parentNode.parentNode;
          divToRemove.remove();
          resetCount();

          Swal.fire("Done","","success")
          
        };

      });

  };

}






let array = [
    {
      "title": "عمر بن عبد العزيز",
      "answers": ["aanglena ","احمد الحلواني","3","4"],
      "right_answer": "3"
    },
    {
      "title": "Why We Use Element?",
      "answers": ["1","2","3","4"],
      "right_answer": "3"
    },
    {
      "title": "Why We Use Element?",
      "answers": ["1","2","3","4"],
      "right_answer": "3"
    },
    {
      "title": "Why We Use Element?",
      "answers": ["1","2","3","4"],
      "right_answer": "3"
    },
    {
      "title": "Why We Use Element?",
      "answers": ["1","2","3","4"],
      "right_answer": "3"
    },
    
];










let submitButton = document.querySelector(".submit-button");




submitButton.addEventListener("click",async()=>{

  let Questions = examDATA[0].theExam;

  
  if(userName.trim()!==""&&phoneNumber.trim()!==""&&phoneNumber.length==11){

    let isDone = [];
    for(let i=0; i<Questions.length; i++){
      
      let selectedOption = document.querySelector(`.answers-area-${i+1}`).querySelector("input:checked");

      if (selectedOption!==null) {
        let value = selectedOption.value;
        Questions[i].student_answer = value;
        isDone.push(true)
      } else {
        isDone.push(false);
        Swal.fire(`برجاء التاكد من اجابة جميع الاسئلة `,"","error")
        return 0;
      };
    }

    if(!isDone.includes(false)){

      Swal.fire({
        title: 'Please Wait!',
        didOpen: () => {
          Swal.showLoading()
        }
      });

      let True = 0;
      Questions.forEach(e=>{
        if(e.right_answer==e.student_answer){
          True++
        }
      });


      let id = `${(Math.random()*10000000).toFixed()}`;

      await setDoc(doc(db,"exams",`${examDATA[0].id}`,`results`,`${id}`),{
        id: id,
        userName: userName,
        phoneNumber: phoneNumber,
        Questions: Questions,
        result: True+"/"+Questions.length,
      }).then(el=>{
        Swal.fire("Done","","success");

        console.log(examDATA[0].is)

        if(examDATA[0].isHidden==true){

          Swal.fire("تم ارسال اجاباتك بالتوفيق","","success").then(el=>{
            window.close();
          });
          
        }else{

          Swal.fire("Your Score Is: "+True+"/"+Questions.length,"","success").then(el=>{
            window.close();
          });

        };




        document.querySelector(".CreateQuizDiv").style.display="none";
        document.querySelector(".quiz-app").style.display="none";

      })
     


    };

  }else{
    Swal.fire(`برجاء التاكد من كتابة الاسم ورقم الهاتف بشكل صحيح`,"","error")
  }




});



































function showAllQuestions(array){

    
    let dadOfQuestions = document.querySelector(".dadOfQuestions");
    
    dadOfQuestions.innerHTML=``;
    
    for(let i = 0; i<array.length; i++){
    
        let divForAnswers = document.createElement("div");
        // console.log(array[i].answers);

        for(let j = 0; j<array[i].answers.length; j++){
          divForAnswers.innerHTML+=`
            
          <div class="answer">
              <input class="answersInput" ${(j==1)?"required":""} name="question" type="radio" class="answer_${i+1}" id="answer_${i+1}_${j+1}" value="${array[i].answers[j]}" data-answer="${array[i].answers[j]}">
              <label for="answer_${i+1}_${j+1}">${array[i].answers[j]}</label>
          </div>
          
          `
        }

    
       
        dadOfQuestions.innerHTML+=`
        
        
        <div class="questionDiv" style="position: relative;">
            <p class="questionNumer">${i+1}</p>
            <div class="quiz-area" dir="auto">
              <img src="${array[i].titleImage}" class="questionImg" style="width: 100%; display: ${array[i].titleImage==""?"none":"block"};">
              <bdi class="theQuestion" dir="auto">
              ${array[i].title}
              </bdi>
            </div>
      
            <form class="answers-area answers-area-${i+1}" dir="auto">
              ${divForAnswers.innerHTML}
            </form>
    
        </div>
        
        
        
        `;
    
    };
    

}    













function timer(hours) {
  // Convert hours to milliseconds
  var milliseconds = hours * 3600000;

  // Calculate the end time
  var endTime = Date.now() + milliseconds;

  // Run the timer loop
  var intervalId = setInterval(function() {
    var remainingTime = endTime - Date.now();

    // Check if the timer has ended
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      console.log("Timer has ended!");
      Swal.fire("انتهي الوقت","لديك دقيقة لارسال الاجابات قبل ان تغلق الصفحة","error").then(el=>{
        setTimeout(closeWindow,60000);

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 60000,
          timerProgressBar: true,
        })
        
        Toast.fire({
          icon: 'info',
          title: 'ستغلق الصفحة قريبا اسرع'
        })


        function closeWindow(){
          console.log("closeddd");
          window.close();
        }
      })
     

      return;
    }

    var seconds = Math.floor(remainingTime / 1000) % 60;
    var minutes = Math.floor(remainingTime / 1000 / 60) % 60;
    var hours = Math.floor(remainingTime / 1000 / 60 / 60);


    document.querySelector(".timer").innerHTML=`${hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" +seconds.toString().padStart(2, "0")}`
    
    
  }, 1000);
}

// Example usage: create a timer for 2 hours









