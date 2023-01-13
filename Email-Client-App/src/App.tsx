import { useState,useEffect } from "react";
import classes from "./App.module.css";
import Card from "./components/Card/Card";

const App = () => {
  const [emails,setEmails] = useState([]);
  const [showBodyContent, setShowBodyContent] = useState(false);

  const onButtonClickHandler = () => {
    setShowBodyContent(prevState => !prevState)
  };

  useEffect(() => {},[])

  return (
    <div className={classes.app}>
      <section className={classes.filterSection}>
        <span>Filter By:</span>
        <button>Unread</button>
        <button>Read</button>
        <button>Favorites</button>
      </section>
      <div className={classes.container}>
        <section
          className={
            showBodyContent ? classes.minMainSection : classes.mainSection
          }
        >
          <Card clicked={() => onButtonClickHandler()} />
          <Card />
          <Card />
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
                  <h1>Lorem ipsum</h1>
                  <span className={classes.dateSection}>
                    <p>26/02/2020</p>
                    <p>10:30 am</p>
                    {/* <p className={classes.tag}>Favorite</p> */}
                  </span>
                </div>
              </div>
              <button className={classes.markFavoriteBtn}>Mark as favorite</button>
            </header>
            <section className={classes.swipeableSectionBody}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                consequat ultrices neque ullamcorper molestie. Fusce feugiat
                arcu in quam lacinia faucibus. Nulla nec turpis accumsan, luctus
                tortor dignissim, consequat ante. Aliquam sem ipsum, elementum
                at maximus quis, feugiat in ligula. Praesent scelerisque lorem
                vitae ex cursus, at interdum sem ullamcorper. Vivamus ornare
                nunc ut urna porttitor eleifend. Morbi eu erat non velit
                convallis pharetra nec ac mauris. Cras neque erat, euismod sit
                amet justo et, fringilla sollicitudin quam. Nulla luctus ante
                justo, quis sodales dolor blandit vitae.
              </p>
              <p>
                Nulla venenatis ligula ac arcu vehicula volutpat. Nulla
                facilisi. Aenean pharetra in arcu ac sollicitudin. Nam lobortis
                ex diam, et congue lacus rhoncus at. In hac habitasse platea
                dictumst. Nunc molestie pellentesque dolor, a dapibus arcu
                ullamcorper in. Morbi posuere est nunc, eget pellentesque sapien
                blandit ut. Cras accumsan, est ut semper feugiat, nibh dui
                consectetur leo, id accumsan neque enim at metus. Sed ut gravida
                erat, ut euismod erat. Morbi venenatis justo in rutrum egestas.
                Vestibulum vitae felis arcu. Aenean non imperdiet diam, eget
                ultrices elit. Sed in dolor ipsum. Vestibulum nec ante est.
                Pellentesque habitant morbi tristique senectus et netus et
              </p>
              <p>
                malesuada fames ac turpis egestas. Praesent aliquet ex eu lacus
                aliquet, quis porttitor sem gravida. Donec efficitur sed neque a
                auctor. Aliquam luctus nisi a velit viverra, sit amet tempor
                nisl venenatis. Mauris elementum malesuada felis nec vulputate.
                Nulla facilisi. Duis elementum justo at gravida tincidunt.
                Vivamus tincidunt sapien vitae iaculis posuere. Mauris pharetra
                ex nec accumsan vestibulum. Nullam lobortis dapibus orci, nec
                venenatis lectus consequat nec. Aenean interdum vehicula lacus
                nec placerat. Nunc imperdiet odio in diam pulvinar, non
                tincidunt diam rhoncus. Maecenas mattis neque vel odio
                vestibulum cursus. Proin sollicitudin pulvinar metus, in
                convallis mauris vehicula et.
              </p>
            </section>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;
