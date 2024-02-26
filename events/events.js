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

const eventsList = $( "ul#event-list" );

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

            let address = "";
            if ( event.location ) {
                address += event.location.name;
                if ( event.location.address ) {
                    address += `<br>
                    ${ event.location.address.streetAddress }<br>
                    ${ event.location.address.addressLocality }, ${ event.location.address.addressRegion } ${ event.location.address.postalCode }
                    `;
                }
            } else {
                address = "No address provided.";
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
                        <address>${ address }</address>
                        <p><a href="${ event.url }" target="_blank" rel="noopener noreferrer">More info</a></p>
                    </div>
                </article>
                </li>`;

            if ( !document.getElementById( id ) ) {
                eventsList.innerHTML += `<li id="${ id }"><h2>${ startMonth }, ${ startYear }</h2><ul class="event-list-month">${ list }</ul></li>`;
            } else {
                const monthItem = document.getElementById( id );
                const month = monthItem.querySelector( ".event-list-month" );
                month.innerHTML += list;
            }
        }
    } );
}

function appendCategoryFilter() {
    const categoryFilter = $( "#event-filter" );

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

    const noFilter = Array.from( categoryCheckboxes ).every( checkbox => checkbox.checked === false );

    categoryCheckboxes.forEach( checkbox => {
        const categoryEvents = events.filter( event => event.category === checkbox.value );

        if ( noFilter ) {
            events.forEach( event => event.active = true );
        } else {
            categoryEvents.forEach( event => {
                if ( checkbox.checked ) {
                    event.active = true;
                } else {
                    event.active = false;
                }
            } );
        }
    } );

    eventsList.innerHTML = "";
    appendEvents();
};
