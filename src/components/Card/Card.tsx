import type  { FC } from "react";
import classes from "./Card.module.css";

interface CardProps {
  name: string;
  email: string;
  subject: string;
  description: string;
  date: string;
  time: string;
  read?: boolean;
  favorite?: boolean;
  clicked: () => void;
  }

const Card: FC<CardProps> = (props) => {
  const readCard = props.read ? classes.read : "";
  return (
    <section className={`${classes.card} ${readCard}`} onClick={props.clicked}>
      <span className={classes.avatar}>
        <p>{props.name.slice(0, 1).toUpperCase()}</p>
      </span>
      <div className={classes.cardBody}>
        <header className={classes.cardHeader}>
          <p>
            From : <b>&lt;{props.email} &gt;</b>
          </p>
          <p>
            Subject : <b>{props.subject}</b>
          </p>
        </header>
        <article className={classes.cardContent}>
          <p className={classes.cardDescription}>{props.description}</p>
        </article>
        <footer className={classes.cardFooter}>
          <div className={classes.dateSection}>
            <p>{props.date}</p>
            <p>{props.time}</p>
          </div>
          {props.favorite && <p className={classes.tag}>Favorite</p>}
        </footer>
      </div>
    </section>
  );
};

export default Card;
