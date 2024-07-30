"use server"

import { signIn, signOut, useSession, getServerSession  } from 'next-auth';
import { redirect } from "next/navigation";


import axios from 'axios';


const secret = process.env.NEXTAUTH_SECRET
//const apiUrl = 'https://graph.microsoft.com/v1.0/users';


export const fetchSingleUser = async (id) => {
  try {
    const apiUrl = `https://graph.microsoft.com/v1.0/users/${id}`;
    console.log(id)

    const token = await getTokenApi()

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json ',
    };
    
    const response = await axios.get(apiUrl, { headers });
    const user = response.data;

    console.log(user);


    console.log('Fetched Single User Data');
    return user;

  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};

export const updateUser = async (formData) => {
  //console.Console(formData)
  const { username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    const token = await getTokenApi()
   
    const data = {
      accountEnabled: true,
      displayName: username,
      mailNickname: email,
      userPrincipalName: `${email}@bharathworkoutlook.onmicrosoft.com`,
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: 'xWwvJ]6NMw+bWH-d'
      }
    };

    console.log(` Data : ${data.displayName}`)
    //console.log(a)

    const userResponse = await updateUserApi(token, data)

    //console.log(userResponse)

  } catch (err) {
    console.log(err);
    throw new Error("Failed to Update user!");
  }

  //revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const addUser = async (formData) => {
  //console.Console(formData)
  const { username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    const token = await getTokenApi()
   
    const apiUrl = 'https://graph.microsoft.com/v1.0/users';

    const data = {
      accountEnabled: true,
      displayName: username,
      mailNickname: email,
      userPrincipalName: `${email}${env("email")}`,
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: `${env("password")}`
      }
    };

    //console.log(a)

    const userResponse = await addUserApi(token, data)

    //console.log(userResponse)

  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user!");
  }

  //revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const fetchUser = async (id) => {
  try {

    const a = await getTokenApi()
    //console.log(a)

    const users = await getUsersApi(a)

    //console.log(users)

    const count = 3
    return { count, users };  

  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};


export const authenticate = async (prevState, formData) => {
  // ...
  try {
    console.log('inside authenticate')
    await signIn(
      'azure-ad',
      { callbackUrl: '/dashboard' },
      { prompt: 'login' },
    );
  } catch (err) {
    // Handle errors as needed
    console.error(err);
    console.log('error inside authenticate')
    return "Authentication failed";
  }
};



async function getTokenApi() {
  try {

//////////////////////////////
const url = 'https://login.microsoftonline.com/ae540c42-66b9-461f-b86d-d898b590ad87/oauth2/v2.0/token';

    const headers = {     
      'Content-Type': 'application/json',
    };

    const formData = new FormData();
    formData.append('grant_type','client_credentials')
    formData.append('client_id',`${env("client_id")}`)
    formData.append('client_secret',`${env("client_secret")}`)
    formData.append('scope','https://graph.microsoft.com/.default')

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }

     
  return await axios.post(url, formData, config )
  .then(res => {
    return(res.data.access_token);
  });





  } catch (error) {
    return {
      error: 'RefreshAccessTokenError',
    };
  }
}



async function getUsersApi(token) {
  try {
//////////////////////////////
const apiUrl = 'https://graph.microsoft.com/v1.0/users';

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await axios.get(apiUrl, { headers });
    const users = response.data.value;

    //console.log('inside here user')
    
    return users;

/////////////////////////////////////

  } catch (error) {
    return {
      error: 'user Inside user APi call',
    };
  }
}


async function addUserApi(token, data) {
  try {
const apiUrl = 'https://graph.microsoft.com/v1.0/users';

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await axios.post(apiUrl, data, { headers } );
    //console.log(response);
    const user = response.data.value;

    console.log('New User Addedd Successfully')
    
    return user;

  } catch (error) {
    return {
      error: 'New User Addition failed',
    };
  }
}

async function updateUserApi(token, data) {
  try {
 const apiUrl = `https://graph.microsoft.com/v1.0/users/${data.userPrincipalName}`;

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await axios.patch(apiUrl, data, { headers } );
    //console.log(response);
    const user = response.data.value;

    console.log('Update Details Updated Successfully')
    
    return user;

  } catch (error) {
    return {
      error: 'User Updation failed',
    };
  }
}



