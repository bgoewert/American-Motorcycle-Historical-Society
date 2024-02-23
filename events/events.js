"use strict";

const $ = ( selector ) => selector.includes( "#" ) ? document.querySelector( selector ) : document.querySelectorAll( selector );

const eventsList = $( "ul.events-list" )[ 0 ];

var events = {};

/* Get events from events.json */
fetch( "events.json" )
    .then( response => response.json() )
    .then( data => {
        data.items.forEach( event => {
            // Get date object from start date
            const date = new Date( event.startDate );

            // Create heading for each month
            const monthNumber = date.toISOString().slice( 5, 7 );
            const year = date.getFullYear();
            const id = `${ year }-${ monthNumber }`;

            id in events ? events[ id ].push( event ) : events[ id ] = [ event ];
        } );
    } )
    .then( () => appendEvents() );


function appendEvents() {

    // Sort events by date
    Object.entries( events ).sort( ( a, b ) => a[ 0 ] - b[ 0 ] );

    Object.entries( events ).forEach( ( id, month ) => {
        const monthName = new Date( id ).toLocaleString( "default", { month: "long" } );
        const year = id.slice( 0, 4 );

        console.log( month, id );

        // eventsList.innerHTML += `<h2>${ monthName } ${ year }</h2>`;

        month.forEach( event => {
            const date = new Date( event.startDate );
            const day = date.getDate();
            const month = date.toLocaleString( "default", { month: "long" } );
            const year = date.getFullYear();

            eventsList.innerHTML += `<li>${ month } ${ day }, ${ year }: ${ event.summary }</li>`;
        } );
    } );
}