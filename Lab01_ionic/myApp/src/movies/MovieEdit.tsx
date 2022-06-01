import React, {useContext, useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {getLogger} from "../core";
import {MovieProps} from "./MovieProp";
import {
    createAnimation,
    IonActionSheet,
    IonButton,
    IonButtons, IonCheckbox, IonCol,
    IonContent, IonDatetime, IonFab, IonFabButton, IonGrid,
    IonHeader, IonIcon, IonImg,
    IonInput, IonItem, IonLabel,
    IonLoading,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {MovieContext} from "./MovieProvider";
import {Photo, usePhotoGallery} from "../core/usePhotoGallery";
import {camera, trash} from "ionicons/icons";
import {useMyLocation} from "../core/useMyLocation";
import {MyMap} from '../core/MyMap';
import {MyModal} from "../core/MyModal";


const log = getLogger('MovieEdit');

interface MovieEditProps extends RouteComponentProps<{
    id?: string;
}> {
}

const inputStyle = {
    background: 'grey',
    color: 'black',
    margin: '10px',
    width: '30%'
}
const checkboxStyle = {
    margin: '5px 0 -3px 10px',
}
const contentStyle = {
    margin: "20px",
    display: "flex",
    flexDirection: 'column' as 'column',
    alignItems: "center"
}
const photoStyle = {
    width: '30%',
    margin: "0 0 0 35%"
}
const animationStyle = {
    background: '#428cff',
    color: 'white'
}

const MovieEdit: React.FC<MovieEditProps> = ({history, match}) => {
    // the current context value (as given by the nearest context provider for the given context) and it's properties
    // will be stored in the object bellow
    const {movies, saving, savingError, saveMovie} = useContext(MovieContext);

    // makes a correlation btw a variable and a function which will update it
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState(new Date());
    const [numberOfReviews, setNumberOfReviews] = useState(0);
    const [score, setScore] = useState(0);
    const [awardNominated, setAwardNominated] = useState(true);
    const [directorName, setDirectorName] = useState('');
    const [movie, setMovie] = useState<MovieProps>();

    const [showStoredPictures, setShowStoredPictures] = useState<boolean>(false);
    const [webViewPath, setWebViewPath] = useState('');
    const {photos, takePhoto, deletePhoto} = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();

    const [showMap, setShowMap] = useState<boolean>(false);
    const [latitude, setLatitude] = useState<number | undefined>(undefined);
    const [longitude, setLongitude] = useState<number | undefined>(undefined);
    const [currentLatitude, setCurrentLatitude] = useState<number | undefined>(undefined);
    const [currentLongitude, setCurrentLongitude] = useState<number | undefined>(undefined);
    const location = useMyLocation();
    const {latitude: lat, longitude: lng} = location.position?.coords || {};

    const [showModal, setShowModal] = useState<boolean>(false);
    useEffect(simpleAnimation, []);

    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const movie = movies?.find(it => it._id == routeId);
        setMovie(movie);
        if (movie) {
            setTitle(movie.title);
            if (movie.releaseDate) {
                setReleaseDate(movie.releaseDate)
            }
            if (movie.numberOfReviews) {
                setNumberOfReviews(movie.numberOfReviews)
            }
            if (movie.score) {
                setScore(movie.score)
            }
            if (movie.awardNominated != null) {
                setAwardNominated(movie.awardNominated)
            }
            if (movie.directorName) {
                setDirectorName(movie.directorName);
            }
            if (movie.latitude) {
                setLatitude(movie.latitude);
            }
            if (movie.longitude) {
                setLongitude(movie.longitude);
            }
            if (movie.webViewPath) {
                setWebViewPath(movie.webViewPath);
            }
        }
    }, [match.params.id, movies]);

    useEffect(() => {
        if (latitude === undefined && longitude === undefined) {
            setCurrentLatitude(lat);
            setCurrentLongitude(lng);
        } else {
            setCurrentLatitude(latitude);
            setCurrentLongitude(longitude);
        }
    }, [lat, lng, longitude, latitude]);

    const handleSave = () => {
        const editedMovie = movie ? {
                ...movie,
                title,
                releaseDate,
                numberOfReviews,
                score,
                awardNominated,
                directorName,
                latitude: latitude,
                longitude: longitude,
                webViewPath: webViewPath
            }
            : {
                title,
                releaseDate,
                numberOfReviews,
                score,
                awardNominated,
                directorName,
                latitude: latitude,
                longitude: longitude,
                webViewPath: webViewPath
            };
        saveMovie && saveMovie(editedMovie).then(() => history.goBack());
    };

    async function handlePhotoChange() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const image = await takePhoto();
        if (!image) {
            setWebViewPath('');
        } else {
            setWebViewPath(image);
        }
    }

    function setLocation() {
        setLatitude(currentLatitude);
        setLongitude(currentLongitude);
    }

    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <div className="square-a">
                        <p style={animationStyle}>animation</p>
                    </div>
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.goBack()}>
                            Back
                        </IonButton>
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div style={contentStyle}>
                    Title<IonInput style={inputStyle} value={title} onIonChange={e => setTitle(e.detail.value || '')}/>
                    Release Date<IonDatetime style={inputStyle} value={String(releaseDate)} onIonChange={e => {
                    if (e.detail.value) {
                        setReleaseDate(new Date(e.detail.value) || new Date())
                    }
                }}/>
                    Number Of Reviews<IonInput style={inputStyle} value={numberOfReviews} type="number"
                                               onIonChange={e => {
                                                   if (e.detail.value) setNumberOfReviews(parseInt(e.detail.value) || 0)
                                               }}/>
                    Score<IonInput style={inputStyle} value={score} type="number"
                                   onIonChange={e => {
                                       if (e.detail.value && parseInt(e.detail.value) < 10) setScore(parseInt(e.detail.value) || 0)
                                   }}/>
                    Award Nominated<IonCheckbox style={checkboxStyle} checked={awardNominated}
                                                onIonChange={e => setAwardNominated(e.detail.checked || false)}/>
                    <hr/>
                    Director<IonInput style={inputStyle} value={directorName}
                                      onIonChange={e => setDirectorName(e.detail.value || '')}/>
                    Latitude<IonInput style={inputStyle} readonly>{latitude}</IonInput>
                    Longitude<IonInput style={inputStyle} readonly>{longitude}</IonInput>
                    <IonLoading isOpen={saving}/>
                    {savingError && (
                        <div>{savingError.message || 'Failed to save Movie'}</div>
                    )}
                </div>

                {webViewPath && (<img style={photoStyle} onClick={handlePhotoChange} src={webViewPath} width={'200px'} height={'200px'}/>)}
                {!webViewPath && (
                    <IonFab vertical="bottom" horizontal="center" slot="fixed">
                        <IonFabButton onClick={handlePhotoChange}>
                            <IonIcon icon={camera}/>
                        </IonFabButton>
                    </IonFab>)}

                {showModal &&
                <MyModal/>
                }

                {showMap &&
                <div>
                    <IonItem>
                        <IonButton slot="end" onClick={setLocation}>Set location</IonButton>
                    </IonItem>
                    {lat && lng &&
                    <MyMap
                        lat={currentLatitude}
                        lng={currentLongitude}
                        onMapClick={log('onMap')}
                        onMarkerClick={log('onMarker')}
                    />
                    }
                </div>}


                {showStoredPictures &&
                <div>
                    <IonGrid>
                        <IonRow>
                            {photos.map((photo, index) => (
                                <IonCol size="6" key={index}>
                                    <IonImg onClick={() => setPhotoToDelete(photo)}
                                            src={photo.webviewPath}/>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                    <IonActionSheet
                        isOpen={!!photoToDelete}
                        buttons={[{
                            text: 'Delete',
                            role: 'destructive',
                            icon: trash,
                            handler: () => {
                                if (photoToDelete) {
                                    deletePhoto(photoToDelete);
                                    setPhotoToDelete(undefined);
                                }
                            }
                        }, {
                            text: 'Cancel',
                            icon: 'close',
                            role: 'cancel'
                        }]}
                        onDidDismiss={() => setPhotoToDelete(undefined)}
                    />
                </div>
                }
                <IonFab vertical="center" horizontal="start" slot="fixed">
                    <IonFabButton onClick={() => setShowStoredPictures(!showStoredPictures)}>
                        Pics
                    </IonFabButton>
                    <IonFabButton onClick={() => setShowMap(!showMap)}>
                        Map
                    </IonFabButton>
                    <IonFabButton onClick={() => setShowModal(!showModal)}>
                        Modal
                    </IonFabButton>
                </IonFab>

            </IonContent>
        </IonPage>
    );

    function simpleAnimation() {
        const el = document.querySelector('.square-a');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    { offset: 0, transform: 'scale(3)', opacity: '1', color: 'red'},
                    {offset: 1, transform: 'scale(1.5)', opacity: '0.5', color: 'red'}
                ]);
            animation.play();
        }
    }
};

export default MovieEdit;
