import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from '../../api';

const Search = ({ onSearchChange }) => {

    const [search, setSearch] = useState(null);

    const loadOptions = (inputValue)=> {
        
        //here we set minimum populcation to be 1 mil to filter out the small cities
        //return fetch(`${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`, geoApiOptions)

        return fetch(
            `${GEO_API_URL}/cities?namePrefix=${inputValue}`,
            geoApiOptions
        )
        .then((response) => response.json())
        .then((response) => {
            return {
                options: response.data.map((city) => {
                    return {
                        value: `${city.latitude} ${city.longitude}`,
                        label: `${city.name}, ${city.countryCode}`,
                    };
                }),
            };
        });
        //.catch((err) => console.error(err));
    };

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    };

    return (
        <AsyncPaginate
            placeholder='Search for city'
            
            //we don't want to fetch api and call back too fast if someone spams the key
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
        //because we are loading from asyncronous request (not downloaded),
        //when typing, it searches the api for the city name right away
    );
};

export default Search;