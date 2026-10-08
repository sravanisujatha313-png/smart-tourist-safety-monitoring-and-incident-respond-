// guide.js

function showPlaces(){

    document.getElementById("guideResult").innerHTML = `
        <h3>📍 Popular Tourist Places</h3>
        <ul>
            <li>🏖️ Beaches</li>
            <li>🏛️ Historical Monuments</li>
            <li>🛕 Temples</li>
            <li>🌳 Nature Parks</li>
            <li>🏞️ Hill Stations</li>
        </ul>
    `;

}


function showSafety(){

    document.getElementById("guideResult").innerHTML = `
        <h3>🛡️ Travel Safety Tips</h3>
        <ul>
            <li>Keep emergency contacts saved.</li>
            <li>Share your live location with trusted people.</li>
            <li>Avoid unknown places at night.</li>
            <li>Carry important documents safely.</li>
            <li>Use safe transportation.</li>
        </ul>
    `;

}


function showEssentials(){

    document.getElementById("guideResult").innerHTML = `
        <h3>🎒 Travel Essentials</h3>
        <ul>
            <li>Identity Proof</li>
            <li>Mobile Charger / Power Bank</li>
            <li>Basic Medicines</li>
            <li>Cash and Cards</li>
            <li>Emergency Contact Details</li>
        </ul>
    `;

}


window.onload = function(){

    console.log("Travel Guide Loaded Successfully");

};