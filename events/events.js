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

const events = [];
const categories = [];

function displayEvents( limit = 0, divideMonths = true, filter = true ) {

    /* Get events from events.json */
    fetch( "/events/events.json" )
        .then( response => response.json() )
        .then( data => {

            // Sort events by startDate
            data.items.sort( ( a, b ) => {
                return new Date( a.startDate ) - new Date( b.startDate );
            } );

            // Limit the number of events to display
            if ( limit ) {
                data.items = data.items.slice( 0, limit );
            }

            data.items.forEach( event => {
                event.active = true;
                events.push( event );
                categories.push( { "name": event.category, "active": false } );
            } );
        } )
        .then( () => {
            appendEvents( divideMonths );
            if ( filter ) appendCategoryFilter();
        } );

}

function appendEvents( divideMonths = true ) {

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

            list += `<li class="object-list-item" data-category="${ slugCategory }">\
                <article class="object">
                    <figure>
                        <img src="${ event.image }" alt="Event image for ${ event.title }">
                    </figure>
                    <div class="object-list-item-details" aria-label="event details">
                        <h4>${ event.title }</h4>
                        <time datetime="${ event.startDate }/${ event.endDate }">${ dateFormatted }</time>
                        <p>${ event.description }</p>
                        <address>${ address }</address>
                        <p><a href="${ event.url }" target="_blank" rel="noopener noreferrer">More info</a></p>
                    </div>
                </article>
                </li>`;

            if ( !document.getElementById( id ) ) {
                if ( divideMonths ) {
                    $( "ul.object-list" ).innerHTML += `<li id="${ id }"><h2>${ startMonth }, ${ startYear }</h2><ul class="object-list-section">${ list }</ul></li>`;
                } else {
                    $( "ul.object-list" ).innerHTML += list;
                }
            } else {
                const monthItem = document.getElementById( id );
                const month = monthItem.querySelector( ".object-list-section" );
                month.innerHTML += list;
            }
        }
    } );
}

function appendCategoryFilter() {
    const categoryFilter = $( "#list-filter" );

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

    $( "ul.object-list" ).innerHTML = "";
    appendEvents();
};
