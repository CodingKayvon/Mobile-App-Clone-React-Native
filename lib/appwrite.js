import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.craizer.zephyr',
  projectId: '66734360002a5a8fed88',
  databaseId: '66734ba700241a5d4b9e',
  userCollectionId: '6673523d001c9a8db0da',
  videoCollectionId: '6673527c001317709ac2',
  storageID: '6674a39f001eec19a2b5'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases =  new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
    ID.unique(),
    email, 
    password, 
    username
    )

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password);

    const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id, 
            email, 
            username, 
            avatar: avatarUrl
        }
    )

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

}

// Sign In
export async function signIn(email, password) {
    try {
      const session = await account.createSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }