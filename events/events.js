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

    for ( const [ id, month ] of Object.entries( events ) ) {
        const monthName = new Date( id ).toLocaleString( "default", { month: "long" } );
        const year = id.slice( 0, 4 );

        month.forEach( event => {
            const startDate = new Date( event.startDate );
            const startDay = startDate.getDate();
            const startMonth = startDate.toLocaleString( "default", { month: "long" } );
            const startYear = startDate.getFullYear();
            const endDate = new Date( event.endDate );
            const endDay = endDate.getDate();
            const endMonth = endDate.toLocaleString( "default", { month: "long" } );
            const endYear = endDate.getFullYear();

            let dateFormatted = "";
            if ( startYear === endYear ) {
                if ( startMonth === endMonth ) {
                    if ( startDay === endDay ) {
                        dateFormatted = `${ startMonth } ${ startDay }, ${ startYear }`;
                    } else {
                        dateFormatted = `${ startMonth } ${ startDay }-${ endDay }, ${ startYear }`;
                    }
                } else {
                    dateFormatted = `${ startMonth } ${ startDay } - ${ endMonth } ${ endDay }, ${ startYear }`;
                }
            }

            let list = '';

            list += `<li>
            <h3>${ event.title }</h3>
            <div>
                <time datetime="${ event.startDate }/${ event.endDate }">${ dateFormatted }</time>
                <p>${ event.description }</p>
                <address>${ event.location.name }</address>
            </div>
            </li>`;

            eventsList.innerHTML += `<li id="${ id }"><h2>${ startMonth } ${ startDay }, ${ startYear }</h2><ul class="events-list-month">${ list }</ul></li>`;
        } );
    };
}