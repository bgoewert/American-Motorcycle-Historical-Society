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

const memberships = [];

function displayMemberships() {

    let json = "";
    if ( window.location.pathname === "/" || window.location.pathname === "/American-Motorcycle-Historical-Society/" ) {
        json = "./contribute/memberships.json";
    } else {
        json = "memberships.json";
    }

    fetch( json )
        .then( response => response.json() )
        .then( data => data.items.forEach( membership => memberships.push( membership ) ) )
        .then( () => appendMemberships() );

}

function appendMemberships() {

    let list = '';

    memberships.forEach( membership => {

        const price = new Intl.NumberFormat( 'en-US', {
            style: 'currency',
            currency: 'USD',
        } ).format( membership.price );

        const benefits = membership.benefits.map( benefit => {
            return `<li><b>${ benefit.caption }:</b> ${ benefit.description }</li>`;
        } ).join( "" );

        list += `<li class="object-list-item">
<article class="object">
    <div class="object-list-item-details" aria-label="museum details">
        <h4>${ membership.title }</h4>
        <h5>${ price }</h5>
        <ul class="membership-benefits">${ benefits }</ul>
        <a href="#" class="button">Join Now</a>
    </div>
</article>
</li>`;
    } );

    const membershipList = document.querySelector( "#membership-levels ul.object-list" );
    membershipList.innerHTML = list;
}
