"use strict";

// Get element(s) by CSS selector, using regex to check if the selector is an ID or class
const $ = ( selector ) => {
    // separate all selectors from the string
    const selectors = selector.split( " " );

    if ( selectors.length === 1 ) {
        // if there is only one selector, return the element
        return document.querySelector( selector );
    } else {
        // if the last selector is an ID, return the element
        if ( selectors[ selectors.length - 1 ].match( /#[a-z]/i ) ) {
            return document.querySelector( selector );
        } else {
            // else return a list of elements
            return document.querySelectorAll( selector );
        }
    };
};

const museums = [];
const states = [
    { "name": "Alabama", "abbr": "AL" },
    { "name": "Alaska", "abbr": "AK" },
    { "name": "Arizona", "abbr": "AZ" },
    { "name": "Arkansas", "abbr": "AR" },
    { "name": "California", "abbr": "CA" },
    { "name": "Colorado", "abbr": "CO" },
    { "name": "Connecticut", "abbr": "CT" },
    { "name": "Delaware", "abbr": "DE" },
    { "name": "Florida", "abbr": "FL" },
    { "name": "Georgia", "abbr": "GA" },
    { "name": "Hawaii", "abbr": "HI" },
    { "name": "Idaho", "abbr": "ID" },
    { "name": "Illinois", "abbr": "IL" },
    { "name": "Indiana", "abbr": "IN" },
    { "name": "Iowa", "abbr": "IA" },
    { "name": "Kansas", "abbr": "KS" },
    { "name": "Kentucky", "abbr": "KY" },
    { "name": "Louisiana", "abbr": "LA" },
    { "name": "Maine", "abbr": "ME" },
    { "name": "Maryland", "abbr": "MD" },
    { "name": "Massachusetts", "abbr": "MA" },
    { "name": "Michigan", "abbr": "MI" },
    { "name": "Minnesota", "abbr": "MN" },
    { "name": "Mississippi", "abbr": "MS" },
    { "name": "Missouri", "abbr": "MO" },
    { "name": "Montana", "abbr": "MT" },
    { "name": "Nebraska", "abbr": "NE" },
    { "name": "Nevada", "abbr": "NV" },
    { "name": "New Hampshire", "abbr": "NH" },
    { "name": "New Jersey", "abbr": "NJ" },
    { "name": "New Mexico", "abbr": "NM" },
    { "name": "New York", "abbr": "NY" },
    { "name": "North Carolina", "abbr": "NC" },
    { "name": "North Dakota", "abbr": "ND" },
    { "name": "Ohio", "abbr": "OH" },
    { "name": "Oklahoma", "abbr": "OK" },
    { "name": "Oregon", "abbr": "OR" },
    { "name": "Pennsylvania", "abbr": "PA" },
    { "name": "Rhode Island", "abbr": "RI" },
    { "name": "South Carolina", "abbr": "SC" },
    { "name": "South Dakota", "abbr": "SD" },
    { "name": "Tennessee", "abbr": "TN" },
    { "name": "Texas", "abbr": "TX" },
    { "name": "Utah", "abbr": "UT" },
    { "name": "Vermont", "abbr": "VT" },
    { "name": "Virginia", "abbr": "VA" },
    { "name": "Washington", "abbr": "WA" },
    { "name": "West Virginia", "abbr": "WV" },
    { "name": "Wisconsin", "abbr": "WI" },
    { "name": "Wyoming", "abbr": "WY" },
    { "name": "American Samoa", "abbr": "AS" },
    { "name": "District of Columbia", "abbr": "DC" },
    { "name": "Federated States of Micronesia", "abbr": "FM" },
    { "name": "Guam", "abbr": "GU" },
    { "name": "Marshall Islands", "abbr": "MH" },
    { "name": "Northern Mariana Islands", "abbr": "MP" },
    { "name": "Palau", "abbr": "PW" },
    { "name": "Puerto Rico", "abbr": "PR" },
    { "name": "Virgin Islands", "abbr": "VI" }
];

function displayMuseums( limit = 0, divideStates = true ) {

    let json = "";
    if ( window.location.pathname === "/" || window.location.pathname === "/American-Motorcycle-Historical-Society/" ) {
        json = "./museums/museums.json";
    } else {
        json = "museums.json";
    }

    fetch( json )
        .then( response => response.json() )
        .then( data => {

            // sort items by state
            data.items.sort( ( a, b ) => {
                return a.location.address.addressRegion.localeCompare( b.location.address.addressRegion );
            } );

            // Limit the number of items to display
            if ( limit ) {
                data.items = data.items.slice( 0, limit );
            }

            data.items.forEach( museum => {
                museums.push( museum );

                // Check if state abbr or full name
                if ( museum.location.address.addressRegion.length > 2 ) {
                    // Get the state abbreviation

                }
            } );
        } )
        .then( () => {
            appendMuseums( divideStates );
        } );

}

function appendMuseums( divideStates = true ) {

    museums.forEach( museum => {

        // get state abbreviation and full name
        const state = states.find( state => {
            if ( state.name === museum.location.address.addressRegion ) {
                return state;
            } else if ( state.abbr === museum.location.address.addressRegion ) {
                return state;
            }
        } );

        let address = "";
        if ( museum.location && museum.location.address ) {
            address += `
                ${ museum.location.address.streetAddress }<br>
                ${ museum.location.address.addressLocality }, ${ state.abbr } ${ museum.location.address.postalCode }
                `;
        } else {
            address = "No address provided.";
        }

        let list = '';

        list += `<li class="object-list-item">\
                <article class="object">
                    <figure>
                        <img src="${ museum.image }" alt="Museum logoz for ${ museum.title }">
                    </figure>
                    <div class="object-list-item-details" aria-label="museum details">
                        <h4>${ museum.title }</h4>
                        <p>${ museum.description }</p>
                        <address>${ address }</address>
                        <p><a href="${ museum.url }" target="_blank" rel="noopener noreferrer">More info</a></p>
                    </div>
                </article>
                </li>`;

        if ( !document.getElementById( state.abbr ) ) {
            if ( divideStates ) {
                $( "ul.object-list" ).innerHTML += `<li id="${ state.abbr }"><h2>${ state.name }</h2><ul class="object-list-section">${ list }</ul></li>`;
            } else {
                $( "ul.object-list" ).innerHTML += list;
            }
        } else {
            const stateItem = document.getElementById( state.abbr );
            const stateSection = stateItem.querySelector( ".object-list-section" );
            stateSection.innerHTML += list;
        }
    } );
}
