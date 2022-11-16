import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, increment, orderBy, where } from "firebase/firestore";
import { db } from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

let userDataCache = null

export const setUserData = (async(userData) => {
  const userCollRef = collection(db, 'users')

  return new Promise((resolve, reject)=> {
    setDoc(doc(userCollRef, userData.uid), userData).then((querySnapshot) => {
      resolve(userData)
    }).catch((error)=> {
      reject(error)
    })
  })
})


// Should remove id and fetch from cookie
export const getUserData = (async(id) => {

  if (userDataCache) 
  {
    // console.log("Returning cache data")
    return userDataCache
  }
  
  return new Promise((resolve, reject)=> {
    getDoc(doc(db, `users/${id}`)).then((querySnapshot) => {
      resolve(querySnapshot.data())
      //TODO - remove
      userDataCache = querySnapshot.data()
    }).catch(()=> {
      reject(null)
    })
  })
})

export const removeUserCache = (() => {
  userDataCache = null
})

export const getUserDataByUrl = (async(id) => {

  return new Promise((resolve, reject)=> {
    getDocs(query(collection(db, "users"), where("userUrlId", "==", id))).then((querySnapshot) => {
      let userData = null
      querySnapshot.forEach((doc) => {
        userData = doc.data()
      if (userData)
        resolve(userData)
      else  
        reject(null)
      })
    }).catch((error) => {
      reject(null)
    })
  })
})

export const updateUserData = (async(userData, uid) => {
  const userCollRef = collection(db, 'users')
  return new Promise((resolve, reject)=> {
    updateDoc(doc(userCollRef, uid), userData).then((querySnapshot) => {
      resolve(userData)
      removeUserCache()
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const bookNewAppointment = (async(data) => {
  const appntCollRef = collection(db, `users/${data.userId}/appointments`)
  data.appntId = doc(appntCollRef).id
  return new Promise((resolve, reject)=> {
    setDoc(doc(appntCollRef, data.appntId), data).then((querySnapshot) => {
      updateUserData({appointmentsCount : increment(1)}, data.userId).then(() => {
        resolve('')
      })
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const sendNewEnquiry = (async(data) => {
  const enqCollRef = collection(db, `users/${data.userId}/enquiries`)
  data.enqId       = doc(enqCollRef).id

  return new Promise((resolve, reject)=> {
    setDoc(doc(enqCollRef, data.enqId), data).then((querySnapshot) => {
      updateUserData({enquiriesCount : increment(1)}, data.userId).then(() => {
        resolve('')
      })
    }).catch((error)=> {
      reject(error)
    })
  })
})


export const uploadImage = (async(fileData, fileMetadata, fileName, path) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${path}/${fileName}`);

  let metadata = {
    contentType: fileMetadata.type,
  };

  return new Promise((resolve, reject) => {
    uploadBytes(storageRef, fileData, metadata).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        resolve(downloadURL)
      })
    })
  })
})

export const getAppointments = (async(userId) => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, `users/${userId}/appointments`),    
                                  orderBy('timeStamp', 'desc') )).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        eventItems.push(doc.data())      
      })
      resolve(eventItems)
    }).catch(()=> {
      reject([])
    })
  })
})

export const getEnquiries = (async(userId) => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, `users/${userId}/enquiries`),
                                  orderBy('timeStamp', 'desc'))).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        eventItems.push(doc.data())      
      })
      resolve(eventItems) 
    }).catch(()=> {
      reject([])
    })
  })
})

export const getCouponCode = (async(code) => {
  return new Promise((resolve, reject) => {
    getDoc(query(doc(db, `coupons/${code}`))).then((querySnapshot) => {
      resolve(querySnapshot.data())
    }).catch((error) => {
      reject('')
    })
  })
})

export const getGlobals = (async(code) => {
  return new Promise((resolve, reject) => {
    getDoc(query(doc(db, `globals/globals`))).then((querySnapshot) => {
      resolve(querySnapshot.data())
    }).catch((error) => {
      reject('')
    })
  })
})

export const getThemes = (async(code) => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, 'themes'))).then((querySnapshot) => {
      let themes = []
      querySnapshot.forEach((doc) => {
        themes.push(doc.data())      
      })
      resolve(themes)
    }).catch((error)=> {
      reject(null)
    })
  })  
})

/*===============================================================
              APIS FOR POSTER MAKER
===============================================================*/

export const getPosterCategories = (async() => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, 'categories'))).then((querySnapshot) => {
      let categoryItems = []
      querySnapshot.forEach((doc) => {
        categoryItems.push(doc.data())      
      })
      resolve(categoryItems)
    }).catch((error)=> {
      reject(null)
    })
  })
})

export const getEventList = (async(id) => {
  return new Promise((resolve, reject)=> {
    getDocs(query(collection(db, `categories/${id}/events`))).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        eventItems.push(doc.data())      
      })
      resolve(eventItems)
    }).catch(()=> {
      reject([])
    })
  })
})

export const getPosters = (async(path) => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, path))).then((querySnapshot) => {
      let posterItems = []
      querySnapshot.forEach((doc) => {
        posterItems.push(doc.data())      
      })
      resolve(posterItems)
    }).catch(()=> {
      reject([])
    })
  }) 
})
