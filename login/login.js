

/////* start firebase */////

import {docName, sendPasswordResetEmail ,getAuth ,createUserWithEmailAndPassword,sendEmailVerification ,signInWithEmailAndPassword ,signOut ,firebaseConfig,initializeApp ,getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, updateDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt, startAfter,endAt  } from "../firebase.js";


firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = firebase.storage();

let X;

async function getCit(db,X) {
  const citiesCol = collection(db,`${X}`);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}
/*1*/








let signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up", userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up:", error.message);
      Swal.fire("Error signing up",error.message.slice(16),"error")
    }
};
  

  
let signOutUser = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
};
  




/*Start Sing In*/


document.querySelector(".btn-sign-in").addEventListener("click",async()=>{
    let email =  document.querySelector(".email-in").value;
    let password =  document.querySelector(".password-in").value;


    if (email.trim()!==""&&password.trim()!=="") {

        Swal.fire({
            title: 'Please Wait!',
            didOpen: () => {
              Swal.showLoading()
            }
        });

        /* start auth sign */


        try {
            let userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in:", userCredential.user);

            let user = userCredential.user;
            if (user.emailVerified) {

              console.log("User signed in:", user);
              console.log(user.uid);

              let q = query(collection(db, "accounts"), where("uid", "==", `${user.uid}`));
              let snapshot = await getCountFromServer(q);
              console.log(snapshot.data().count);
  
              let querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                  if(doc.data().id!==undefined){
                      document.querySelector(".email-in").value="";
                      document.querySelector(".password-in").value="";
                      /**/
                          
                      localStorage.setItem(`${docName}`,doc.data().uid);
                      localStorage.setItem(`${docName}_uid`,user.uid);
                      doc.data().password="";
                      localStorage.setItem(`${docName}_personData`,JSON.stringify(doc.data()));
                      /**/
                      location.href="../dashboard.html";
                  } else {
                      Swal.fire("","Email Or Password Are Wrong","error");
                  };
              });

            } else {

              console.log("Email not verified. Sending verification email.");
              await sendEmailVerification(user);
              console.log("Signed out unverified user. Verification email sent to:", user.email);
              Swal.fire("Your email is not verified", "Please check your email for the verification link","error");
            
            }


        } catch (error) {
            console.error("Error signing in:", error.message);
            Swal.fire(error.message.slice(22,-2),"","error")
        }


        /* end auth sign */


    } else {Swal.fire("","Enter Email And Password","error")}

});

/*End Sing In*/






















/////* end firebase */////















/* start create account */

document.querySelector(".btn-sign-up").addEventListener("click",async()=>{
    let username = document.querySelector(".username-up").value.trim();
    let password = document.querySelector(".password-up").value.trim();
    let email = document.querySelector(".email-up").value.trim();
    let adminCodeUp = document.querySelector(".AdminCode-up").value.trim();
    let name = username;

    if(username!=""&&password!=""&&email!=""&&adminCodeUp!="")
    {

        Swal.fire({
            title: 'Please Wait!',
            didOpen: () => {
              Swal.showLoading()
            }
        });

        
        let q_AdminCode = query(collection(db, `${adminCodeUp}`), where("adminCode", "==", `${adminCodeUp}`));
        let snapshot_AdminCode = await getCountFromServer(q_AdminCode);
        console.log(snapshot_AdminCode.data().count);

        if(snapshot_AdminCode.data().count!==0){
    
                Swal.fire({
                    title: 'Please Wait!',
                    didOpen: () => {
                      Swal.showLoading()
                    }
                });
    
                let id = Math.floor(Math.random() * 1000000000000);
    
    
                /* start auth */
    
                await signUp(email, password).then(async res=>{
                    console.log(res.uid);
                    setDoc(doc(db,"accounts",`${res.uid}`),{
                        id: id,
                        uid: res.uid,
                        isAdmin: true,
                        name: name,
                        username: username,
                        email: email,
                        date: Date.now(),
                    }).then(async e=>{
        
                        
                        document.querySelector(".username-up").value="";
                        document.querySelector(".password-up").value="";
                        document.querySelector(".email-up").value="";
                        document.querySelector(".AdminCode-up").value="";
                        
                        /**/
                        Swal.fire(
                            ' Account has been Created ',
                            ' You Can Now Log In ',
                            'success'
                        );
                        /**/
                        
                        document.querySelector("#tab-1").click();
                        await signOutUser();
                    });
                    
                })
                
                /* end auth */
    
    
    
    
            
    
      
            
        } else{
            Swal.fire(""," Admin Code Not True","error")
        }



    }else {
        Swal.fire("","Enter Username,Password, Email and admin Code ","error");
    };

});

/* end create account */

















/* start Forgot account Password account */


document.querySelector(".ForgotPassword").addEventListener("click",()=>{
    
    Swal.fire({
        title: ' Reset Password ',
        html: `
    
        <div class="mainForm" style="overflow-y: hidden; overflow-c: scroll; font-size: 19px!important; font-family: 'Cairo', sans-serif; font-weight: bold!important;">
        
            <label for="Email">Enter Your Email: </label>
            <input style="width: 98%;" class="InputSwal" type="text" dir="rtl" autocomplete="off" id="Email">

        </div>
        
        `,
        confirmButtonText: 'Ok',
        showCancelButton: true,
    }).then(async (result) => {

        
        if (result.isConfirmed) {


            let Email = document.querySelector("#Email").value.trim();
        

            if(Email!==""){

                Swal.fire({
                    title: 'Please Wait!',
                    didOpen: () => {
                      Swal.showLoading()
                    }
                })


                try {
                    await sendPasswordResetEmail(auth, Email);
                    console.log(`Password reset email sent to ${Email}`);
                    Swal.fire('Password reset email sent.',"Please check your email inbox.","info");
                } catch (error) {
                    console.error("Error sending password reset email:", error.message);
                    Swal.fire(error.message.slice(22,-2),"","error");
                }

            };
        
        };

    });


});    



/* start Forgot account Password  */























// await getDoc(doc(db, "accounts", "L8tRIutxitBgha5OdTby")).then(e=>cs(e.data()))



