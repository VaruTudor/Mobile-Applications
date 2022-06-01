import {
    IonButton, IonButtons,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton, IonGrid,
    IonHeader,
    IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonList,
    IonLoading,
    IonPage, IonRow, IonSearchbar, IonSelect, IonSelectOption,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React, {useContext, useEffect, useState} from "react";
import Movie from "./Movie";
import {getLogger} from "../core";
import {add} from "ionicons/icons";
import {RouteComponentProps} from "react-router";
import {MovieContext} from "./MovieProvider";
import {useNetwork} from "../core/useNetwork";
import {AuthContext} from "../auth";
import {MovieProps} from "./MovieProp";

const log = getLogger('MovieList');
const offset = 2;
const filterValues = ["Nominated", "Not Nominated"]


const MovieList: React.FC<RouteComponentProps> = ({history}) => {
    const {networkStatus} = useNetwork();
    const {movies, fetching, fetchingError} = useContext(MovieContext);
    const {logout} = useContext(AuthContext);
    const [pageSize, setPageSize] = useState(offset);
    const [visibleMovies, setVisibleMovies] = useState<MovieProps[] | undefined>([])
    const [disableScroll, setDisableScroll] = useState<boolean>(false)
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState<string>("");
    log('render');

    // pagination
    useEffect(() => {
        if (movies?.length && movies?.length > 0) {
            fetchData();
        }
    }, [movies]);

    // filtering
    useEffect(() => {
        if (movies && filter) {
            setVisibleMovies(movies.filter(movie => {
                if (filter === "Nominated")
                    return movie.awardNominated === true
                else
                    return movie.awardNominated === false
            }));
        }
    }, [filter]);

    // serach
    useEffect(() => {
        if (search === "") {
            setVisibleMovies(movies);
        }
        if (movies && search !== "") {
            setVisibleMovies(movies.filter(movie => movie.title.startsWith(search)));
        }
    }, [search])

    function fetchData() {
        setVisibleMovies(movies?.slice(0, pageSize + offset));
        setPageSize(pageSize + offset);
        if (movies && pageSize > movies?.length) {
            setDisableScroll(true);
            setPageSize(movies.length);
        } else {
            setDisableScroll(false);
        }
    }

    async function searchNext($event: CustomEvent<void>) {
        fetchData();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My Movies</IonTitle>
                    <IonSelect style={{ width: '40%', marginRight: '20px' }} value={filter} placeholder="Filter" onIonChange={(e) => setFilter(e.detail.value)}
                    slot="end">
                        {filterValues.map((each) => (
                            <IonSelectOption key={each} value={each}>
                                {each}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                    <IonSearchbar style={{ width: '20%' }} placeholder="Search by title" value={search} debounce={200} onIonChange={(e) => {
                        setSearch(e.detail.value!);
                    }} slot="end">
                    </IonSearchbar>
                    {networkStatus.connected ? <IonLabel style={{ marginRight: '5px' }} slot="end">🟢</IonLabel> :
                        <IonLabel style={{ marginRight: '5px' }} slot="end">🔴</IonLabel>}
                    <IonButtons slot="end">
                        {/* eslint-disable-next-line no-restricted-globals */}
                        <IonButton onClick={handleLogout}>
                            Logout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching Movies"/>
                {visibleMovies && (
                    <main>
                        {Array.from(visibleMovies).filter(each => {
                            if (filter !== undefined)
                                if (filter === "Nominated"){
                                    return each.awardNominated === true && each._id !== undefined;
                                } else{
                                    return each.awardNominated === false && each._id !== undefined;
                                }
                            return each._id !== undefined;
                        }).map(({
                                    _id, title, releaseDate, numberOfReviews,
                                    score, awardNominated, directorName, webViewPath
                                }) =>
                            <Movie key={_id} _id={_id} title={title} releaseDate={releaseDate}
                                   numberOfReviews={numberOfReviews} score={score} awardNominated={awardNominated}
                                   directorName={directorName} webViewPath={webViewPath} onEdit={(_id: any) => history.push(`/movie/${_id}`)}/>)}
                    </main>
                )}

                <IonInfiniteScroll threshold="100px" disabled={disableScroll}
                                   onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent>
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch Movies'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push('/movie')}>
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );

    function handleLogout() {
        log("logout");
        logout?.();
    }
};

export default MovieList;
