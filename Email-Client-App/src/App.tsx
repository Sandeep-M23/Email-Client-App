import { useState,useEffect, useRef, useLayoutEffect } from "react";
import axios from 'axios';
import classes from "./App.module.css";
import Card from "./components/Card/Card";

const App = () => {
  const [emails, setEmails] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [read, setRead] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [specificEmail, setSpecificEmail] = useState({});
  const [showBodyContent, setShowBodyContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showReadEmails, setShowReadEmails] = useState(false);
  const [showUnreadEmails, setShowUnreadEmails] = useState(false);
  const [pages,setPages] = useState(1);

  const ref = useRef();

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
  //       setShowBodyContent(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", checkClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", checkClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    const getFavoriteEmails = JSON.parse(
      localStorage.getItem("favorites") || "0"
    );
    if (getFavoriteEmails !== 0) {
      setFavorite([...getFavoriteEmails]);
    }

    const getReadEmails = JSON.parse(localStorage.getItem("read") || "0");
    if (getReadEmails !== 0) {
      setRead([...getReadEmails]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://flipkart-email-mock.now.sh/?page=${pages}`).then((response) => {
      const emails = response.data.list.map((email) => {
        let date = new Date(email.date).toLocaleDateString("en-GB");
        let time = new Date(email.date)
          .toLocaleTimeString()
          .replace(/(.*)\D\d+/, "$1");

        return { ...email, date, time };
      });
      setEmails(emails);
      setLoading(false);
    });
    console.log(emails)
  }, [pages]);

  const onButtonClickHandler = (email) => {
    scrollToTop()
    let id = email.id;
    axios
      .get(`https://flipkart-email-mock.now.sh/?id=${id}`)
      .then((response) => {
        let body = response.data.body;
        let requiredEmail = {
          ...email,
          body,
        };
        setSpecificEmail(requiredEmail);
      });
    console.log(emails);
    setShowBodyContent(true);

    let readArray = read;
    let addToRead = true;

    readArray.map((item: any, key: number) => {
      if (item.id === id) {
        addToRead = false;
      }
    });

    if (addToRead) {
      readArray.push(email);
    }
    setRead([...readArray]);

    localStorage.setItem("read", JSON.stringify(read));
  };

  const onFavoriteClickHandler = (email, id) => {
    let favoritesArray = favorite;
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
    setFavorite([...favoritesArray]);

    localStorage.setItem("favorites", JSON.stringify(favorite));
  };

  const getUnreadEmailsHandler = () => {
    setShowUnreadEmails((prevState) => !prevState);
    if (!showUnreadEmails) {
      const unread = emails.filter(
        (firstArrayItem) =>
          !read.some(
            (secondArrayItem) => firstArrayItem.id === secondArrayItem.id
          )
      );
      setFilteredEmails(unread);
    } else {
      setFilteredEmails([]);
    }
    setShowFavorites(false);
    setShowReadEmails(false);
  };

  const getReadEmailsHandler = () => {
    setShowReadEmails((prevState) => !prevState);
    if (!showReadEmails) {
      setFilteredEmails(read);
    } else {
      setFilteredEmails([]);
    }
    setShowFavorites(false);
    setShowUnreadEmails(false);
  };

  const getFilterByFavoritesHandler = () => {
    setShowFavorites((prevState) => !prevState);
    if (!showFavorites) {
      setFilteredEmails(favorite);
    } else {
      setFilteredEmails([]);
    }
    setShowReadEmails(false);
    setShowUnreadEmails(false);
  };

  const changePageHandler = (e:any) => {
    const pageValue = e.target.value;
    setPages(pageValue);
  }

  let mails =
    filteredEmails.length === 0
      ? emails.map((e) => {
          return (
            <Card
              key={e.id}
              name={e.from.name}
              email={e.from.email}
              subject={e.subject}
              date={e.date}
              time={e.time}
              description={e.short_description}
              clicked={() => onButtonClickHandler(e, e.id)}
              read={read.find((r) => r.id === e.id)}
              favorite={favorite.find((f) => f.id === e.id)}
            />
          );
        })
      : filteredEmails.map((e) => {
          return (
            <Card
              key={e.id}
              name={e.from.name}
              email={e.from.email}
              subject={e.subject}
              date={e.date}
              time={e.time}
              description={e.short_description}
              clicked={() => onButtonClickHandler(e, e.id)}
              read={read.find((r) => r.id === e.id)}
              favorite={favorite.find((f) => f.id === e.id)}
            />
          );
        });

  return (
    <div className={classes.app}>
      <section className={classes.filterSection}>
        <span>Filter By:</span>
        <button
          onClick={(e) => getUnreadEmailsHandler()}
          value="Unread"
          className={`${classes.filterBtns} ${
            showUnreadEmails && classes.active
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => getReadEmailsHandler()}
          value="read"
          className={`${classes.filterBtns} ${
            showReadEmails && classes.active
          }`}
        >
          Read
        </button>
        <button
          onClick={() => getFilterByFavoritesHandler()}
          value="favorites"
          className={`${classes.filterBtns} ${showFavorites && classes.active}`}
        >
          Favorites
        </button>
      </section>
      <div className={classes.container} ref={ref}>
        <section
          className={
            showBodyContent ? classes.minMainSection : classes.mainSection
          }
        >
          {!loading && mails}
        </section>
        {showBodyContent && (
          <section className={classes.swipeableSection}>
            {/* <img src="" alt="F" className={classes.avatar} /> */}
            <span className={classes.avatar}>
              <p>F</p>
            </span>
            <div>
              <header className={classes.swipeableSectionHeader}>
                <div className={classes.innerHeaderSection}>
                  <div>
                    <h1>{specificEmail.subject}</h1>
                    <span className={classes.dateSection}>
                      <p>{specificEmail.date}</p>
                      <p>{specificEmail.time}</p>
                      {/* <p className={classes.tag}>Favorite</p> */}
                    </span>
                  </div>
                </div>
                <button
                  className={`${classes.markFavoriteBtn} ${
                    favorite.find((e) => e.id === specificEmail.id) &&
                    classes.markedFavorite
                  }`}
                  onClick={() =>
                    onFavoriteClickHandler(specificEmail, specificEmail.id)
                  }
                >
                  {favorite.find((e) => e.id === specificEmail.id)
                    ? "Remove as Favorite"
                    : "Mark as Favorite"}
                </button>
              </header>
              <section className={classes.swipeableSectionBody}>
                <div dangerouslySetInnerHTML={{ __html: specificEmail.body }} />{" "}
                {/*NEED TO FIND A BETTER SOLUTION */}
              </section>
            </div>
          </section>
        )}
      </div>
      <div className={classes.footer}>
        <button value="1" onClick={(e) => changePageHandler(e)}>1</button>
        <button value="2" onClick={(e) => changePageHandler(e)}>2</button>
      </div>
    </div>
  );
};

export default App;