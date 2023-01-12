import React from "react";
import classes from "./Card.module.css";

const Card = () => {
  return (
    <div className={classes.card}>
      {/* <img src="" alt="F" className={classes.avatar} /> */}
      <span className={classes.avatar}>
        <p>F</p>
      </span>
      <article>
        <header className={classes.cardHeader}>
          <p>
            From : <b>&lt;Foo Bar foo.bar@gmail.com &gt;</b>
          </p>
          <p>
            Subject : <b>Lorem Ipsum</b>
          </p>
        </header>
        <section className={classes.cardContent}>
          <p>Card description or content goes here.</p>
        </section>
        <footer className={classes.cardFooter}>
          <p>26/02/2020</p>
          <p>10:30 am</p>
          {/* <p className={classes.tag}>Favorite</p> */}
        </footer>
      </article>
    </div>
  );
};

export default Card;
