import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { dataconvert } from "../../repository/dataconvert";
import { SpinnerCircular } from "spinners-react";
import "./Search.css";
import { LangContext } from "../../components/Context/Context";

function Search() {
    const [res, setRes] = useState("movie");
    const [queryParameters] = useSearchParams();
    const searchQuery = queryParameters.get("query");
    const { language } = useContext(LangContext);
    const [searchData, setSearch] = useState([]);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMjQxMWVlNzkzNzNhYmU3OWRiNGRiYTNmZjkzYTJkZCIsInN1YiI6IjY2NTAxOTI1YmMyMjhiZWI5MjA2ODU3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XM9Ycvg4HIOfMbqZ6SzAv7fkC-pPDfRSRw9wpvZqB24",
                },
            };

            try {
                if (searchQuery) {
                    setLoader(true);
                    const response = await axios.get(
                        `https://api.themoviedb.org/3/search/${res}?query=${searchQuery}&include_adult=false&language=${language}-US&page=1`,
                        options
                    );
                    setSearch(response.data.results);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoader(false);
            }
        };

        fetchData();
    }, [searchQuery, language, res]);

    const navigate = useNavigate();
    const handleClick = (id) => {
        navigate(res === "movie" ? `/movies/${id}` : `/tv/${id}`);
    };

    if (loader) {
        return (
            <div className="loader">
                <SpinnerCircular
                    size={100}
                    thickness={100}
                    speed={100}
                    color="#000"
                    secondaryColor="rgba(0, 0, 0, 0.3)"
                />
            </div>
        );
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="search">
            <div className="searchId">
                <div className="asd">
                    <div className="title">
                        <h3>{language === "en" ? "Search Results" : "Результаты поиска"}</h3>
                    </div>
                    <ul>
                        <li>
                            <button onClick={() => setRes("movie")}>
                                {language === "en" ? "Movies" : "Фильмы"}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setRes("tv")}>
                                {language === "en" ? "TV Shows" : "Сериалы"}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setRes("person")}>
                                {language === "en" ? "People" : "Люди"}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="searchResults">
                {searchData.length === 0 ? (
                    <div className="no-results">
                        {language === "en" ? "No results found" : "Результаты не найдены"}
                    </div>
                ) : (
                    searchData.map((item) => (
                        <div
                            onClick={() => handleClick(item.id)}
                            className="searchCard"
                            key={item.id}
                        >
                            <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} />
                            <div className="searchTexts">
                                <h2>{item.title || item.name}</h2>
                                <p>{dataconvert(item.release_date || item.first_air_date)}</p>
                                <h4>{item.overview}</h4>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Search;