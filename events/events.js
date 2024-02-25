"use strict";

const $ = ( selector ) => document.querySelectorAll( selector );

const eventsList = $( "ul#event-list" )[ 0 ];

const events = [];
const categories = [];

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

            event.active = true;
            events.push( event );
            categories.push( { "name": event.category, "active": false } );
        } );
    } )
    .then( () => {
        appendEvents();
        appendCategoryFilter();
    } );


function appendEvents() {

    // Sort events by startDate
    events.sort( ( a, b ) => {
        return new Date( a.startDate ) - new Date( b.startDate );
    } );

    events.forEach( event => {
        const id = event.startDate.slice( 0, 7 );
        const monthName = new Date( id ).toLocaleString( "default", { month: "long" } );
        const year = id.slice( 0, 4 );

        if ( event.active === true ) {
            const startDate = new Date( event.startDate );
            const startDay = startDate.getDate();
            const startMonth = startDate.toLocaleString( "default", { month: "long" } );
            const startYear = startDate.getFullYear();
            const endDate = new Date( event.endDate );
            const endDay = endDate.getDate();
            const endMonth = endDate.toLocaleString( "default", { month: "long" } );
            const endYear = endDate.getFullYear();
            const slugCategory = event.category.toLowerCase().replace( " ", "-" );

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

            list += `<li class="event-list-item" data-category="${ slugCategory }">\
                <article>
                    <figure>
                        <img src="${ event.image }" alt="Event image for ${ event.title }">
                    </figure>
                    <div class="event-details" aria-label="event details">
                        <h3>${ event.title }</h3>
                        <time datetime="${ event.startDate }/${ event.endDate }">${ dateFormatted }</time>
                        <p>${ event.description }</p>
                        <address>${ event.location.name }</address>
                        <p><a href="${ event.url }" target="_blank" rel="noopener noreferrer">More info</a></p>
                    </div>
                </article>
                </li>`;

            eventsList.innerHTML += `<li id="${ id }"><h2>${ startMonth }, ${ startYear }</h2><ul class="event-list-month">${ list }</ul></li>`;
        }
    } );
}

function appendCategoryFilter() {
    const categoryFilter = $( "#event-filter" )[ 0 ];

    const categoryList = document.createElement( "ul" );
    categoryList.id = "event-category-list";

    categoryList.innerHTML += '<h5>Filter by category</h5>';

    categories.forEach( category => {
        const slug = category.name.toLowerCase().replace( " ", "-" );
        categoryList.innerHTML += `<li><input type="checkbox" id="${ slug }" value="${ category.name }" name="${ category.name }" ${ category.active ? 'checked' : '' }><label for="${ slug }">${ category.name }</label></li>`;
    } );

    categoryFilter.appendChild( categoryList );

    categoryList.addEventListener( "change", filterEvents );
}

function filterEvents() {
    let categoryCheckboxes = $( "#event-category-list input[type=checkbox]" );

    if ( categoryCheckboxes.length === 0 ) return;

    categoryCheckboxes.forEach( checkbox => {
        const categoryEvents = events.filter( event => event.category === checkbox.value );

        if ( checkbox.checked ) {
            categoryEvents.forEach( event => events[ event.id ].active = true );
        } else {
            categoryEvents.forEach( event => event.active = false );
        }
    } );

    console.log( events );

    eventsList.innerHTML = "";
    appendEvents();
};
