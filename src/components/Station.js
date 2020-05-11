import React from 'react';
import logo from '../logo.svg';
import '../App.css';

const googleKey = 'AIzaSyB-EBqq_gQeduoWmQFuCZ-AGAV4GrVkoUQ';
const geoCodingRequest = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleKey}&address=`;

class SearchBar extends React.Component {
    render() {
        return (
            <input
                type="search"
            />
        );
    }
}

export default class Station extends React.Component {
    state = {
        isLoading: true,
        stations: [],
        isEmpty: false
    };

    render() {
        const {isLoading, stations, isEmpty} = this.state;
        return (
            <React.Fragment>
                <h1>Stations</h1>
                <SearchBar/>
                {!isLoading ? (
                    <div>
                        {!isEmpty ? (stations.map(station => {
                            console.debug('station', station);
                            const {id, name, place} = station;
                            return (
                                <div key={id}>
                                    <p>Name: {name}</p>
                                    <p>Ort: {place}</p>
                                    <hr/>
                                </div>
                            );
                        })) : (<h3>No items found...</h3>)}
                    </div>
                    // If there is a delay in data, let's let the user know it's loading
                ) : (
                    <h3>Loading...</h3>
                )}
            </React.Fragment>);
    }

    fetchStation(query) {
        fetch(`http://localhost:3001/stations?query=${query}`)
            .then((stations) => {
                return stations.json();
            })
            .then((stations) => {
                console.log("length", stations.length);
                stations = stations.map((jsonStation) => {
                    let name = '';
                    fetch(geoCodingRequest + jsonStation.coordinates.latitude + ',' + jsonStation.coordinates.longitude)
                        .then((addressAnswer) => {
                            return addressAnswer.json();
                        })
                        .then((addressAnswer) => {
                            addressAnswer.results.map((address) => {
                                if (address.types.includes('transit_station')) {
                                    this.state.stations.map((s) => {
                                        if (s.name === jsonStation.name) {
                                            s.name = name;
                                            s.name = address.address_components[0].long_name;
                                            this.setState(this.state);
                                        }
                                    });
                                }
                            });
                        });
                    console.log('TEMP', name);
                    return {
                        id: (jsonStation.id === 'null' ? Math.ceil(Math.random() * 1000 + 10000) : jsonStation.id),
                        name: (name === '' ? jsonStation.name : name),
                        place: `${jsonStation.coordinates.latitude} ${jsonStation.coordinates.longitude}`
                    }
                });
                if (stations.length === 0) {
                    this.setState({isEmpty: true, isLoading: false});
                    return true;
                }
                console.log('response', stations);
                this.setState({stations: stations, isLoading: false})
            });

        fetch('http://localhost:3001/journey?from=' + 11558 + '&to=' + 10818)
            .then(value => value.json())
            .then(console.log);
    }

    componentDidMount() {
        this.fetchStation(this.props.query);
    }
}