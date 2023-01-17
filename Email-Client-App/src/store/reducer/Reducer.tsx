import { createSlice,PayloadAction } from '@reduxjs/toolkit';

interface Email {
  id: number;
  from : {
    name: string;
    email: string;
  }
  subject: string;
  short_description: string;
  date: string;
  time: string;
  read?: boolean;
  favorite?: boolean;
  body?: string;
}

interface State {
  emails: Email[];
  specificEmail: Email;
  filteredEmails:Email[];
  favorites:Email[];
  readEmails:Email[];
  showFavoriteEmails:boolean;
  showReadEmails:boolean;
  showUnreadEmails:boolean;
  showBodyContent:boolean;
}

const initialState: State = {
  emails: [],
  filteredEmails:[],
  favorites:[],
  readEmails:[],
  specificEmail: {},
  showFavoriteEmails:false,
  showReadEmails:false,
  showUnreadEmails:false,
  showBodyContent:false,
};


export const emailSlice = createSlice({
  name: "emails",
  initialState,
  reducers: {
    receivedEmails(state, action: PayloadAction<Email[]>) {
      let emails = action.payload;
      state.emails = [...emails];
    },
    getSpecificEmail(state, action: PayloadAction<Email>) {
      let email = action.payload;
      state.specificEmail = {...email}
    },
    getFavoriteEmails(state, action:PayloadAction<Email>) {
      let email = action.payload;
      let id = email.id

      let favoritesArray = state.favorites;
      let addToFavorites = true;
  
      favoritesArray.map((item: any, key: number) => {
        if (item.id === id) {
          favoritesArray.splice(key, 1);
          addToFavorites = false;
        }
      });
  
      if (addToFavorites) {
        favoritesArray.push(email);
      }
      state.favorites = [...favoritesArray]
  
      //Adds to local Storage
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
    updateFavoriteEmails(state,action:PayloadAction<Email[]>){
      let updatedFavorites = action.payload;
      state.favorites = [...updatedFavorites];
    },
    getReadEmails(state,action:PayloadAction<Email>){
      let email = action.payload;
      let id = email.id

      let readEmailsArray = state.readEmails
      let readEmail = true;

      readEmailsArray.map((item: any, key: number) => {
        if (item.id === id) {
          readEmail = false;
        }
      });

      if (readEmail) {
        readEmailsArray.push(email);
      }
      state.readEmails = [...readEmailsArray]

      //Adds to local Storage
      localStorage.setItem("readEmail", JSON.stringify(state.readEmails));
    },
    updateReadEmails(state,action:PayloadAction<Email[]>){
      let updatedRead = action.payload;
      state.readEmails = [...updatedRead];
    },
    toggleFilterFavorites(state){
      state.showFavoriteEmails = !state.showFavoriteEmails
      if(state.showFavoriteEmails){
        state.filteredEmails = [...state.favorites]
      }else{
        state.filteredEmails = [];
      }
      state.showReadEmails = false;
      state.showUnreadEmails = false;
      state.showBodyContent = false;
    },
    toggleFilterRead(state){
      state.showReadEmails = !state.showReadEmails
      if(state.showReadEmails){
        state.filteredEmails = [...state.readEmails]
      }else{
        state.filteredEmails = [];
      }
      state.showFavoriteEmails = false;
      state.showUnreadEmails = false;
      state.showBodyContent = false;
    },
    toggleFilterUnread(state){
      state.showUnreadEmails = !state.showUnreadEmails
      if(state.showUnreadEmails){
        const unread = state.emails.filter(
          (firstArrayItem) =>
            !state.readEmails.some(
              (secondArrayItem) => firstArrayItem.id === secondArrayItem.id
            )
        );
        state.filteredEmails = [...unread]
      }else{
        state.filteredEmails = [];
      }
      state.showFavoriteEmails = false;
      state.showReadEmails = false;
      state.showBodyContent = false;
    },
    displayBodyContent(state,action:PayloadAction<boolean>){
      state.showBodyContent = action.payload
    }
  },
});

export const {
  receivedEmails,
  getSpecificEmail,
  getFavoriteEmails,
  updateFavoriteEmails,
  updateReadEmails,
  getReadEmails,
  toggleFilterFavorites,
  toggleFilterUnread,
  toggleFilterRead,
  displayBodyContent
} = emailSlice.actions;
export default emailSlice.reducer;