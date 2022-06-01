import React from "react";
import {MovieProps} from "./MovieProp";
import {IonCard, IonCol, IonItem, IonRow} from "@ionic/react";

interface MoviePropsExt extends MovieProps {
    onEdit: (_id?: string) => void;
}

const photoStyle = {
    width: '30%',
    margin: "0 0 0 35%"
}

const Movie: React.FC<MoviePropsExt> = ({
                                            _id, title, releaseDate, numberOfReviews, score
                                            , directorName, awardNominated, onEdit, webViewPath
                                        }) => {
    return (
        /**
         * JSX is a syntax extension of JavaScript.
         * It's used to create DOM elements which are then rendered in the React DOM.
         * A JavaScript file containing JSX will have to be compiled before it reaches a web browser.
         */
        <IonCard onClick={() => onEdit(_id)}>
            Title<IonItem>{title}</IonItem>
            Release Date<IonItem>{new Date(String(releaseDate)).toDateString()}</IonItem>
            Award Nominated{!awardNominated && <IonItem>✗</IonItem>}
            {awardNominated && <IonItem>✓</IonItem>}
            Director Name<IonItem>{directorName}</IonItem>
            <img style={photoStyle} src={webViewPath} width={'200px'} height={'200px'}/>
        </IonCard>
    );
};

export default Movie;
