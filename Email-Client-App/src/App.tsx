import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useAppSelector, useAppDispatch } from "./hooks/hooks";
import axios from "axios";
import {
  receivedEmails,
  getSpecificEmail,
  getFavoriteEmails,
  getReadEmails,
  toggleFilterFavorites,
  toggleFilterRead,
  toggleFilterUnread,
  updateFavoriteEmails,
  updateReadEmails,
  displayBodyContent
} from "./store/reducer/Reducer";
import Card from "./components/Card/Card";
import Spinner from "./components/Spinner/Spinner";
import classes from "./App.module.css";

interface Email {
  id: number;
  from: {
    name: string;
    email: string;
  };
  subject: string;
  short_description: string;
  date: string;
  time: string;
  read?: boolean;
  favorite?: boolean;
  body?: string;
}

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const emails = useAppSelector((state) => state.emails.emails);
  const specificEmail = useAppSelector((state) => state.emails.specificEmail);
  const filteredEmails = useAppSelector((state) => state.emails.filteredEmails);
  const favorites = useAppSelector((state) => state.emails.favorites);
  const readEmails = useAppSelector((state) => state.emails.readEmails);
  const showFavorites = useAppSelector(
    (state) => state.emails.showFavoriteEmails
  );
  const showReadEmails = useAppSelector((state) => state.emails.showReadEmails);
  const showUnreadEmails = useAppSelector(
    (state) => state.emails.showUnreadEmails
  );
  const showEmailBodyContent = useAppSelector((state) => state.emails.showBodyContent);

  //To open window at top of the page
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //Scroll function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // useEffect(() => {
  //   const checkClickOutside = (e) => {
  //     if (!ref.current.contains(e.target)) {
  //       setShowEmailBodyContent(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", checkClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", checkClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    //Retrieve Favorite Emails from local Storage
    const getFavorites = JSON.parse(localStorage.getItem("favorites") || "0");
    if (getFavorites !== 0) {
      dispatch(updateFavoriteEmails(getFavorites));
    }

    //Retrieve Read Emails from local Storage
    const getReadEmails = JSON.parse(localStorage.getItem("readEmail") || "0");
    if (getReadEmails !== 0) {
      dispatch(updateReadEmails(getReadEmails));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://flipkart-email-mock.now.sh/?page=${page}`)
      .then((response) => {
        const emailList = response.data.list.map((email: Email) => {
          let date = new Date(email.date).toLocaleDateString("en-GB");
          let time = new Date(email.date)
            .toLocaleTimeString()
            .replace(/(.*)\D\d+/, "$1");

          return { ...email, date, time };
        });
        dispatch(receivedEmails(emailList));
        setLoading(false);
      });
  }, [page]);

  const onButtonClickHandler = (email: Email) => {
    let id = email.id;
    axios
      .get(`https://flipkart-email-mock.now.sh/?id=${id}`)
      .then((response) => {
        let body = response.data.body;
        let requiredEmail = {
          ...email,
          body,
        };
        dispatch(getSpecificEmail(requiredEmail));
      });
    dispatch(displayBodyContent(true));
    scrollToTop();

    //Persisting read email
    dispatch(getReadEmails(email));
  };

  const toggleFavoriteHandler = (email: Email, id: number) => {
    dispatch(getFavoriteEmails(email));
  };

  const navigatePageHandler = (e: any) => {
    let pageValue = e.target.value;
    setPage(pageValue);
    scrollToTop()
  };

  let mails =
    filteredEmails.length === 0
      ? emails.map((e: any) => {
          return (
            <Card
              key={e.id}
              name={e.from.name}
              email={e.from.email}
              subject={e.subject}
              date={e.date}
              time={e.time}
              description={e.short_description}
              clicked={() => onButtonClickHandler(e)}
              read={readEmails.find((r: any) => r.id === e.id) ? true : false}
              favorite={
                favorites.find((f: any) => f.id === e.id) ? true : false
              }
            />
          );
        })
      : filteredEmails.map((e: any) => {
          return (
            <Card
              key={e.id}
              name={e.from.name}
              email={e.from.email}
              subject={e.subject}
              date={e.date}
              time={e.time}
              description={e.short_description}
              clicked={() => onButtonClickHandler(e)}
              read={readEmails.find((r: any) => r.id === e.id) ? true : false}
              favorite={
                favorites.find((f: any) => f.id === e.id) ? true : false
              }
            />
          );
        });

  return (
    <div className={classes.app}>
      <section className={classes.filterSection}>
        <label>Filter By:</label>
        <nav className={classes.filterBtnsContainer}>
          <button
            onClick={() => dispatch(toggleFilterUnread())}
            className={`${classes.filterBtns} ${
              showUnreadEmails && classes.active
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => dispatch(toggleFilterRead())}
            className={`${classes.filterBtns} ${
              showReadEmails && classes.active
            }`}
          >
            Read
          </button>
          <button
            onClick={() => dispatch(toggleFilterFavorites())}
            className={`${classes.filterBtns} ${
              showFavorites && classes.active
            }`}
          >
            Favorites
          </button>
        </nav>
      </section>
      <main className={classes.mainContainer} ref={ref}>
        <section
          className={
            showEmailBodyContent
              ? classes.shrinkEmailSection
              : classes.emailSection
          }
        >
          {loading ? <Spinner /> : mails}
        </section>
        {showEmailBodyContent && (
          <section className={classes.emailBodySection}>
            <div className={classes.emailDetails}>
              <header className={classes.emailHeader}>
                <div className={classes.emailHeaderInfo}>
                  <div className={classes.avatar}>
                    <span>
                      <p>F</p>
                    </span>
                  </div>
                  <div>
                    <h1 className={classes.emailSubject}>
                      {specificEmail.subject}
                    </h1>
                    <div>
                      <span className={classes.emailDates}>
                        <p>{specificEmail.date}</p>
                        <p>{specificEmail.time}</p>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className={`${classes.favoriteBtn} ${
                    favorites.find((e) => e.id === specificEmail.id) &&
                    classes.marked
                  }`}
                  onClick={() =>
                    toggleFavoriteHandler(specificEmail, specificEmail.id)
                  }
                  aria-label={
                    favorites.find((e) => e.id === specificEmail.id)
                      ? "Remove as Favorite"
                      : "Mark as Favorite"
                  }
                >
                  {favorites.find((e) => e.id === specificEmail.id)
                    ? "Remove as Favorite"
                    : "Mark as Favorite"}
                </button>
              </header>
              <section className={classes.emailBody}>
                <div dangerouslySetInnerHTML={{ __html: specificEmail.body }} />{" "}
                {/*NEED TO FIND A BETTER SOLUTION */}
              </section>
            </div>
          </section>
        )}
      </main>
      <section className={classes.paginationSection}>
        <button value="1" onClick={(e) => navigatePageHandler(e)}>
          1
        </button>
        <button value="2" onClick={(e) => navigatePageHandler(e)}>
          2
        </button>
      </section>
    </div>
  );
};

export default App;
