import {docName, initializeApp,firebaseConfig ,getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, updateDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt,endAt } from '../firebase.js';
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
let studentAnswerId = urlParams.get('studentAnswerId');
let examResult = urlParams.get('examResult');

let examDATA;



function checkQuizAvailability(dateStart,dateEnd) {
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);
  const currentDate = new Date();

  return currentDate >= startDate && currentDate <= endDate;
}


if(exam!==null&&editExam==null&&studentAnswerId==null){




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

          Swal.fire(`برجاء التاكد من كتابة الاسم ورقم الهاتف بشكل صحيح`,"","error").then(async e=>{
            if(e.isConfirmed){
              location.reload();
            };
          });

        };
       
      };
    })


  } else if(currentDate <= startDate){
    Swal.fire("لم يبدا الاختبار بعد","","error");
  } else if(currentDate >= endDate){
    Swal.fire("انتهي الاختبار ","","error");
  }



  /* */


} else if (exam==null&&studentAnswerId==null&&editExam!==null&&docId!==null){
  




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
            <input dir="auto" class="questionChouse" type="text" name="questions[${index}][answers][${i}]" value="${question.answers[i]!==undefined?`${escapeHtml(question.answers[i])}`:``}">
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
                <i title="انشاء سوال باستخدام الذكاء الاصطناعي" class="fa-solid fa-wand-magic-sparkles ai-btn" style="font-size: 20px; color: white; background: darkred; border-radius: 50%; padding: 7px 6px; cursor: pointer;"></i>
                <i title="حذف" class="fa-solid fa-trash remove" data-question="${escapeHtml(JSON.stringify(question))}" style="font-size: 20px; color: white; background: darkred; border-radius: 50%; padding: 6px 8px; cursor: pointer;"></i>
              </span>

              
             
            </div>

            <img src="${question.titleImage||""}" class="questionImg" style="width: 100%; display: ${question.titleImage==""?"none":"block"}; border-radius: 10px;">
  
            <label for="questions[${index}][title]">Question:</label>

            <i class="fa-solid fa-image addImgToQuestion" id="question_${index}" style="color: darkgreen; cursor: pointer; margin: 5px 10px;"></i>

            <input dir="auto" class="questionTitle" type="text" id="questions[${index}][title]" name="questions[${index}][title]" value="${escapeHtml(question.title)}">
            <br>
            <label for="questions[${index}][title]">Answer:</label>
            <input dir="auto" class="questionRightAnswer" type="text" name="questions[${index}][right_answer]" value="${escapeHtml(question.right_answer)}">
            
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



} else if (exam==null&&studentAnswerId==null&&editExam!==null&&docId==null){
  location.href="./login/login.html";
} else if (exam!==null&&studentAnswerId!==null&&editExam==null){

  
  // Swal.fire({
  //   title: 'Please Wait!',
  //   didOpen: () => {
  //     Swal.showLoading()
  //   }
  // });




  let q = query(collection(db,"exams",`${exam}`,`results`),where("id","==",`${studentAnswerId}`), limit(X||1));
  let snapshot = await getCountFromServer(q);
  console.log(snapshot.data().count)

  if(snapshot.data().count!==1){
    Swal.fire("لا يوجد اجابات لهذا الطالب","","error");
  } else {



    let querySnapshot = await getDocs(q);
    let cityList = querySnapshot.docs.map(doc => doc.data());
    let examDATAwithStudentAnswer = cityList;

    q = query(collection(db, "exams"),where("id","==",`${exam}`), limit(X||1));
    querySnapshot = await getDocs(q);
    cityList = querySnapshot.docs.map(doc => doc.data());
    examDATA = cityList;

    console.log(examDATA);
    console.log(examDATAwithStudentAnswer);


    document.querySelector(".quiz-app").style.display="block";

    document.querySelector(".quiz-info").innerHTML=`

    <bdi style="margin: 5px;font-size: 20px;font-family: cairo;font-weight: bold;">
    اسم الاختبار: ${examDATA[0].examName}
    </bdi>

    <bdi style="margin: 5px;font-size: 20px;font-family: cairo;font-weight: bold;">
    اسم الطالب: ${examDATAwithStudentAnswer[0].userName} 
    </bdi>

    <bdi style="margin: 5px;font-size: 20px;font-family: cairo;font-weight: bold;">
    رقم هاتف الطالب : ${examDATAwithStudentAnswer[0].phoneNumber} 
    </bdi>

    <bdi style="margin: 5px;font-size: 20px;font-family: cairo;font-weight: bold;">
      نتيجة الطالب : ${examDATAwithStudentAnswer[0].result} 
    </bdi>

    `;

    
    showAllQuestionsWithStudentAnswers(examDATAwithStudentAnswer[0].Questions);

  }

} else if (examResult!==null){


  console.log(examResult)
  

  Swal.fire({
    title: 'Please Wait!',
    didOpen: () => {
      Swal.showLoading()
    }
  });

  let examId = examResult;
  console.log(examId)

  let q = query(collection(db,"exams",`${examId}`,`results`));
  let snapshot = await getCountFromServer(q);

  Swal.fire({
      title: '',
      html:`

      <bdi style="margin: 5px;font-size: 24px;font-family: cairo;font-weight: bold;">
      نتايج الطلاب: ${snapshot.data().count} نتيجة
      </bdi>

      <hr>

      <bdi style="margin: 5px;font-size: 24px;font-family: cairo;font-weight: bold;">
      بحث في النتائج:
      </bdi>

      <div class="" style=" border-radius: 6px; border: none; padding: 5px;">
        <select dir="rtl" class="SearchFiledForResult" style="margin: 5px 0px;font-size: 20px;background: white;color: black;padding: 5px;border: 2px solid black;border-radius: 6px;text-align: start;font-weight: bold;">
          <!--<option value="userName">اسم الطالب</option>-->
          <option value="phoneNumber"> رقم هاتف الطالب </option>
        </select>
        <input type="text" dir="auto" placeholder="Search text" class="addOrderInput SearchValueForResult" style="max-width: 150px; font-size: 20px;">
      </div>

      `,
      confirmButtonText:
      `<b>Search <i class="fa-solid fa-magnifying-glass"></i></b>`,
  }).then(async el=>{
    if(el.isConfirmed){
      let SearchFiledForResult = document.querySelector(".SearchFiledForResult").value.trim();
      let SearchValueForResult = document.querySelector(".SearchValueForResult").value.trim();


      if(SearchFiledForResult!==""&&SearchValueForResult!==""){
        let q = query(collection(db,"exams",`${examId}`,`results`),where(`${SearchFiledForResult}`,"==",`${SearchValueForResult}`));
        let querySnapshot = await getDocs(q);
        let cityList = querySnapshot.docs.map(doc => doc.data());

        if(cityList.length<1){
          Swal.fire("لا يوجد بيانات لهذا الرقم","","error")
        } else{
          Swal.fire({
            title: `${cityList[0].userName+"<br>"+cityList[0].result}`,
            icon: 'success',
            showCloseButton: true,
            showConfirmButton: false,
            showCancelButton: false,
            html: `
            
            <a href="${window.location.origin}?exam=${examId}&studentAnswerId=${cityList[0].id}">
              <button style="font-size: 18px; font-family:cairo; cursor:pointer; width: 120px; margin: 20px; border-radius: 10px; background: black; color: white; padding: 5px 0px; font-weight: 600; border: none; min-width: 120px;">اجابات الطالب</button>  
            </a>
            
            `,
          });

        }


      }


    }
  })



}






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
  
  await updateDoc(doc(db,"exams",`${examDATA[0].id}`),{
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
            <i title="انشاء سوال باستخدام الذكاء الاصطناعي" class="fa-solid fa-wand-magic-sparkles ai-btn" style="font-size: 20px; color: white; background: darkred; border-radius: 50%; padding: 7px 6px; cursor: pointer;"></i>
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


window.addEventListener("click",async (e)=>{

  
  if([...e.target.classList].includes("addApiKey")){

    let oldApiKey="";

    if (examDATA[0].apiKey!==undefined){
      oldApiKey=examDATA[0].apiKey;
    };


    let { value: apiKey } = await Swal.fire({
      input: "text",
      inputValue: oldApiKey,
      html: "<h2 style='padding: 0;margin: 0;'>Api Key</h2><a href='https://platform.openai.com/api-keys'>get Api Key</a>",
      inputPlaceholder: "Type your Api Key here...",
      inputAttributes: {
        "aria-label": "Type your Api Key here"
      },
      showCancelButton: true
    });
    if (apiKey) {


      Swal.fire({
        title: 'Please Wait!',
        didOpen: () => {
          Swal.showLoading()
        }
      });

      await updateDoc(doc(db,"exams",`${examDATA[0].id}`),{
        apiKey: apiKey,
      }).then(el=>{
        Swal.fire("Done","","success");
        examDATA[0].apiKey=apiKey;
      })




    };

  };



  if([...e.target.classList].includes("addQuestions")){


    let { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your array of object here...",
      inputAttributes: {
        "aria-label": "Type your questions as object here"
      },
      showCancelButton: true
    });
    if (text) {

      console.log(text)



      let trainingAiText = `make this  questions ${text}  as array of objects and make titleImage: "" like  [
        {
            "right_answer": "Feedback",
            "answers": [
                "Actuator",
                "Feedback",
                "Fog",
                "Process"
            ],
            "titleImage": "",
            "title": "Used by IoT device to provide realtime output information to its controller"
        },
        {
            "title": "Converts physical property into electrical signal",
            "titleImage": "",
            "right_answer": "Sensor",
            "answers": [
                "Controller",
                "Sensor",
                "Actuator",
                "LED"
            ]
      }]

      give me the array of objects direct and the array have the same number of questions i give you


      `;

      
      Swal.fire({
        title: 'Please Wait!',
        didOpen: () => {
          Swal.showLoading()
        }
      });



      await generateQuestions(trainingAiText).then(async (e)=>{

        console.log(e);

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
      
  
        let newArrayOfQuestions = [...filteredData,...JSON.parse(e)];
  
  
  
  
        await updateDoc(doc(db,"exams",`${examDATA[0].id}`),{
          theExam: newArrayOfQuestions,
        }).then(el=>{
          Swal.fire("Done","","success");
          window.location.reload();
        })
  

        
      })






   


    }

  }


  if([...e.target.classList].includes("ai-btn")){
    let QuestionDiv = e.target.parentNode.parentNode.parentNode.parentNode;


    const { value: QuestionSubject } = await Swal.fire({
      title: "Enter Question Subject",
      input: "text",
      inputLabel: "",
      inputPlaceholder: "Subject"
    });
    if (QuestionSubject) {



      Swal.fire({
        title: 'Please Wait!',
        didOpen: () => {
          Swal.showLoading()
        }
      });


      generate(QuestionSubject).then(obj=>{
     
        let parsedObject = obj
        console.log(parsedObject)

        QuestionDiv.querySelector(".questionTitle").value=parsedObject.question;
        
        if (parsedObject.answer == "a"){
          QuestionDiv.querySelector(".questionRightAnswer").value=parsedObject.choices.a;
        } else if (parsedObject.answer == "b"){
          QuestionDiv.querySelector(".questionRightAnswer").value=parsedObject.choices.b;
        } else if (parsedObject.answer == "c"){
          QuestionDiv.querySelector(".questionRightAnswer").value=parsedObject.choices.c;
        } else if (parsedObject.answer == "d"){
          QuestionDiv.querySelector(".questionRightAnswer").value=parsedObject.choices.d;
        }
        
        let questionChouses = [...QuestionDiv.querySelectorAll(".questionChouse")]
        questionChouses[0].value=parsedObject.choices.d
        questionChouses[1].value=parsedObject.choices.c
        questionChouses[2].value=parsedObject.choices.a
        questionChouses[3].value=parsedObject.choices.b



        Swal.fire({
          title: "Done",
          text: "",
          icon: "success"
        });


        console.log(parsedObject.question)
      })
    }



    // QuestionDiv.querySelector(".questionImg").questionTitle

  }

  
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

})








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

        // console.log(examDATA[0].is)

        if(examDATA[0].isHidden==true){

          Swal.fire("تم ارسال اجاباتك بالتوفيق","","success").then(el=>{
            window.close();
          });
          
        }else if(examDATA[0].isHidden!==true&&examDATA[0].trueAnswersShowisHidden!==true){

          // console.log(Questions)

          Swal.fire({
            title: `Your Score Is: ${True}/${Questions.length}`,
            icon: 'success',
            showCloseButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Show Answers',
          }).then(el=>{

            if(el.isConfirmed){
              location.href=window.location.origin+`?exam=${examDATA[0].id}&studentAnswerId=${id}`;
              // console.log("done")
            }else{
              window.close();
            }

          });

        } else if(examDATA[0].isHidden!==true&&examDATA[0].trueAnswersShowisHidden==true){

          // console.log(Questions)

          Swal.fire({
            title: `Your Score Is: ${True}/${Questions.length}`,
            icon: 'success',
            showCloseButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Done',
          }).then(el=>{

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




























function escapeHtml(unsafeInput) {
  return unsafeInput.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}







function showAllQuestions(array){

    
    let dadOfQuestions = document.querySelector(".dadOfQuestions");
    
    dadOfQuestions.innerHTML=``;
    
    for(let i = 0; i<array.length; i++){
    
        let divForAnswers = document.createElement("div");
        // console.log(array[i].answers);

        for(let j = 0; j<array[i].answers.length; j++){


          divForAnswers.innerHTML+=`
            
          <div class="answer">
              <input class="answersInput" ${(j==1)?"required":""} name="question" type="radio" class="answer_${i+1}" id="answer_${i+1}_${j+1}" value="${escapeHtml(array[i].answers[j])}" data-answer="${escapeHtml(array[i].answers[j])}">
              <label for="answer_${i+1}_${j+1}">
                
                ${escapeHtml(array[i].answers[j])}
                
              </label>
              
          </div>
          
          `;
          // ${array[i].answers[j]}
        }

    
       
        dadOfQuestions.innerHTML+=`
        
        
        <div class="questionDiv" style="position: relative;">
            <p class="questionNumer">${i+1}</p>
            <div class="quiz-area" dir="auto">
              <img src="${array[i].titleImage}" class="questionImg" style="width: 100%; display: ${array[i].titleImage==""?"none":"block"};">
              <bdi class="theQuestion" dir="auto">
              ${escapeHtml(array[i].title)}
              </bdi>
            </div>
      
            <form class="answers-area answers-area-${i+1}" dir="auto">
              ${divForAnswers.innerHTML}
            </form>
    
        </div>
        
        
        
        `;
    
    };
    

}    





function showAllQuestionsWithStudentAnswers(array){

  document.querySelector(".submit-button").style.display="none";
  
  let dadOfQuestions = document.querySelector(".dadOfQuestions");
  
  dadOfQuestions.innerHTML=``;
  
  for(let i = 0; i<array.length; i++){
  
      let divForAnswers = document.createElement("div");
      // console.log(array[i].answers);

      for(let j = 0; j<array[i].answers.length; j++){


        if(array[i].right_answer==array[i].student_answer){

          if(array[i].answers[j]==array[i].right_answer){

            console.log(array[i].answers[j]==array[i].right_answer)
  
            divForAnswers.innerHTML+=`
            
            <div class="answer" style="background: #00800024; cursor: auto;">
              <label style="color: green; cursor: auto !important;">${escapeHtml(array[i].answers[j])}</label>
              <i class="fa-solid fa-check trueFalseIcon" style="font-size: 13px; margin: 10px; color: white; background: green; border-radius: 50%; padding: 5px 5px;"></i>
            </div>
            
            `;
            
          } else{

            divForAnswers.innerHTML+=`
          
            <div class="answer" style=" cursor: auto;">
              <label style=" cursor: auto !important;">${escapeHtml(array[i].answers[j])}</label>
            </div>
            
            `;

          }

        }else if(array[i].right_answer!==array[i].student_answer){

          if(array[i].answers[j]==array[i].right_answer){

            console.log(array[i].answers[j]==array[i].right_answer)
  
            divForAnswers.innerHTML+=`
            
            <div class="answer" style="background: #00800024; cursor: auto;">
              <label style="color: green; cursor: auto !important;">${escapeHtml(array[i].answers[j])}</label>
              <i class="fa-solid fa-check trueFalseIcon" style="font-size: 13px; margin: 10px; color: white; background: green; border-radius: 50%; padding: 5px 5px;"></i>
            </div>
            
            `;
            
          } else if(array[i].answers[j]==array[i].student_answer){

            divForAnswers.innerHTML+=`
          
            <div class="answer" style="background: #80000024; cursor: auto;">
              <label style="color: red; cursor: auto !important;">${escapeHtml(array[i].answers[j])}</label>
              <i class="fa-solid fa-xmark trueFalseIcon" style="font-size: 13px; margin: 10px; color: white; background: red; border-radius: 50%; padding: 5px 7px 5px 8px;"></i>
            </div>
            
            `;

          }  else{

            divForAnswers.innerHTML+=`
          
            <div class="answer" style=" cursor: auto;">
              <label style=" cursor: auto !important;">${escapeHtml(array[i].answers[j])}</label>
            </div>
            
            `;

          }
          
        };



      };

  
     
      dadOfQuestions.innerHTML+=`
      
      
      <div class="questionDiv" style="position: relative;">
          <p class="questionNumer">${i+1}</p>
          <div class="quiz-area" dir="auto">
            <img src="${array[i].titleImage}" class="questionImg" style="width: 100%; display: ${array[i].titleImage==""?"none":"block"};">
            <bdi class="theQuestion" dir="auto">
            ${escapeHtml(array[i].title)}
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























/*////////////// ai */
// async function generateQuestions(trainingAiText) {

  
//   let API_URL = "https://api.openai.com/v1/chat/completions";
//   let API_KEY = examDATA[0].apiKey;
  
//     try {
//       // Fetch the response from the OpenAI API with the signal from AbortController
//       let response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "gpt-3.5-turbo",
//           messages: [{ role: "user", content: `${trainingAiText}` }],
//         }),
//       });
  
//       let data = await response.json();
//       // console.log(data.choices[0].message.content)
//       return data.choices[0].message.content;
//     } catch (error) {
//       console.error("Error:", error);
//     };
// };












async function generate(text) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/10.1.0',
      },
      body: JSON.stringify({
        mode: 'no-cors',
        message: `Give me an object that has a question, choices, and a true answer about ${text}. Like this example:
  
          {
            "question": "What is the value of 2 + 2?",
            "choices": {
              "a": 3,
              "b": 4,
              "c": 5,
              "d": 6
            },
            "answer": "b"
          }
  
          Provide only this object, with no extra text.
  
          Make the answer random, not just 'a'; it should be random between 'a', 'b', 'c', or 'd'.
  
          If the object has Arabic or any other language words, make the object choices 'a', 'b', 'c', 'd', not like 'ا', 'ب', 'ج', 'د'.
          `
      }),
    };
    
    const response = await fetch('https://aiiiiiiiii.onrender.com/generate', options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let data = await response.json();
    console.log(data.response);
    data=data.response;
    data = data.replace(/`/g, '');
    data = data.replace(/`/g, '');
    data = data.replace(/`/g, '');


    data=JSON.parse(data);
    console.log(data);

    // Return the generated question object
    return data
    
  } catch (error) {
    console.error("Error fetching the question object:", error);
    // Return or throw the error if needed
    throw error; // Optionally rethrow or return null based on your use case
  }
}




// async function generate(text) {


  
// let API_URL = "https://api.openai.com/v1/chat/completions";
// let API_KEY = examDATA[0].apiKey;

//   try {
//     const options = {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/10.1.0'},
//       body: JSON.stringify({
//         messages: [{ role: "user", content: `give me a object has question and chouses and true answer about ${text} like
  
//         when i need question about math you give me object question like this
        
//         example
  
//         {
//           "question": "What is the value of 2 + 2?",
//           "choices": {
//             "a": 3,
//             "b": 4,
//             "c": 5,
//             "d": 6
//           },
//           "answer": "b"
//         }
  
//         give this to me only no more text,
  
//         make the answer random not chouse a only make it random a or b or c or d,
  
//         if the object has arabic word or any language make the object choices a,b,c,d not like ا ب ج د
  
        
//         ` }],
//       }),
//     };
    
//     fetch('https://aiiiiiiiii.onrender.com/generate', options)
//       .then(response => response.json())
//       .then(response => {
//         console.log(response)
//       })
//       .catch(err => console.error(err));



//     let data = await response.json();
//     // console.log(data.choices[0].message.content)
//     return data.choices[0].message.content;
//   } catch (error) {
//     console.error("Error:", error);
//   };
// };


// generate("question about html").then(obj=>{
//   console.log(obj)
// })
/*/////////////// ai */



// const prompt = "Write a short story about a robot who dreams of becoming a musician.";
// const API_KEY = "AIzaSyByqKeSvCFfDLSSR3cqwFYSrdaofbtCCIU";  // Replace with your actual API key

// const requestOptions = {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${API_KEY}`,
//         'Cors': `Access-Control-Allow-Origin`
//     },
//     body: JSON.stringify({
//         prompt: prompt,
//         // Adjust the parameters as needed by the API
//     })
// };

// try {
//     const response = await fetch('https://api.google.com/generative-model-endpoint', requestOptions);
//     const data = await response.json();
//     console.log(data.generatedText);
// } catch (error) {
//     console.error('Error:', error);
// }



// Import the GoogleGenerativeAI class
// Import the GoogleGenerativeAI class

