document.addEventListener( 'DOMContentLoaded', function () {

    let contactForm = document.querySelector( 'main form' );
    let parent = contactForm.parentElement;
    contactForm.addEventListener( 'submit', event => {
        event.preventDefault();
        contactForm.remove();
        parent.insertAdjacentHTML( 'beforeend', `<hr>` );
        parent.insertAdjacentHTML( 'beforeend', `<p><strong>Thank you for your interest in contacting AMHS!</strong></p>` );
        parent.insertAdjacentHTML( 'beforeend', `<p>This form is not currently functional because it is a static site for an educational project.</p>` );
        parent.insertAdjacentHTML( 'beforeend', `<p>If you really need to contact us, please send an email to <a href="mailto:bgoewert2@my.stlcc.edu">bgoewert2@my.stlcc.edu</a></p>` );

        // append the form data to the page
        let formData = new FormData( contactForm );
        let data = {};
        formData.forEach( ( value, key ) => {
            data[ key ] = value;
        } );
        parent.insertAdjacentHTML( 'beforeend', `<p>Your Submission:</p>` );
        parent.insertAdjacentHTML( 'beforeend', `<pre>${ JSON.stringify( data, null, 2 ) }</pre>` );
    } );
    // ...
} );