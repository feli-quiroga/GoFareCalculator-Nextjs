import React, { useState, useEffect } from 'react'
//import axios from 'axios'

const FormSubmission = () => {

    //Code handles the first form and the revealing of the second form once the first one is submitted
    const [form1Data, setForm1Data] = useState({
        answer: '',
    });

    const [showSecondForm, setShowSecondForm] = useState(false);
    const [showFirstForm, setShowFirstForm] = useState(true);

    const handleForm1Submit = (e) => {
        e.preventDefault();
        setShowSecondForm(true);
        setShowFirstForm(false);
    };

    // Following code will handle the response from the second form, sending it to the backend using axios
    const [form2Data, setForm2Data] = useState({
        stop: '',
        times: '',
        localTransit: '',
        ttc: '',
    })

    const handleForm2Submit = async (e) => {
        e.preventDefault();
        //Check if times per week entered are equal or less than 7
        if (form2Data.times > 7 || form2Data.times <1 ) {
            alert('Please enter a valid number for how many times per week you go to campus');
            return;
        }
        //Hide form
        setShowSecondForm(false);

        //Temporary JS Implementation of original Flask Python backend
        let trainLine = form1Data.answer;
        let stop = form2Data.stop;
        let times = form2Data.times;
        let localTransit = form2Data.localTransit;
        let ttc = form2Data.ttc;

        // Arrays containing the Train Lines, Train Stations, Fares, and Toronto Stations
        let trains = ["Lakeshore East", "Lakeshore West", "Barrie", "Milton", "Kitchener", "Richmond Hill", "Stouffville"];
        // Important: List containing lists containing every possible Go Train Station
        let trainstations = [
            ["Union", "Danforth", "Scarborough", "Eglinton", "Guildwood", "Rouge Hill", "Pickering", "Ajax", "Whitby", "Oshawa"],
            ["Union", "Exhibition", "Mimico", "Long Branch", "Port Credit", "Clarkson", "Oakville", "Bronte", "Appleby", "Burlington", "Aldershot", "Hamilton"],
            ["Union", "Downsview Park", "Rutherford", "Maple", "King City", "Aurora", "Newmarket", "East Gwillimbury", "Bradford", "Barrie South", "Allandale Waterfront"],
            ["Union", "Kipling", "Dixie", "Cooksville", "Erindale", "Streetsville", "Meadowvale", "Lisgar", "Milton"],
            ["Union", "Bloor", "Weston", "Etobicoke North", "Malton", "Bramalea", "Brampton", "Mount Pleasant", "Georgetown", "Acton", "Guelph Central", "Kitchener"],
            ["Union", "Old Cummer", "Langstaff", "Richmond Hill", "Gormley", "Bloomington"],
            ["Union", "Kennedy", "Agincourt", "Milliken", "Unionville", "Centennial", "Markham", "Mount Joy", "Stouffville", "Old Elm"]
        ];
        // Important: List containing lists containing the fare for each Go Train Station, it is in the same order as list above
        let fares = [
            [0, 2.64, 2.64, 3.69, 3.69, 4.74, 5.64, 6.12, 6.84, 7.35],
            [0, 2.64, 2.64, 2.85, 4.29, 5.31, 5.82, 6.66, 7.23, 7.38, 7.89, 8.16],
            [0, 3.69, 4.89, 4.89, 5.61, 6.09, 6.69, 6.84, 7.38, 9.15, 9.48],
            [0, 3.39, 4.29, 4.29, 5.31, 5.88, 6.24, 6.66, 7.35],
            [0, 2.64, 3.39, 3.39, 5.22, 5.73, 6.18, 6.96, 7.50, 8.55, 9.69, 11.64],
            [0, 3.69, 4.83, 4.89, 5.61, 6.03],
            [0, 2.64, 4.62, 5.43, 5.55, 5.64, 5.64, 6.03, 6.84, 6.84]
        ];
        // Set containing all train stations located in Toronto to account for the 2-hour ride free on TTC
        let toronto = new Set(["Union", "Danforth", "Scarborough", "Eglinton", "Guildwood", "Rouge Hill", "Exhibition", "Mimico", "Long Branch", "Downsview Park", "Kipling", "Bloor", "Weston", "Etobicoke North", "Old Cummer", "Langstaff", "Kennedy", "Agincourt"]);

        // Nested function that will gather the data

        // Function that will do all the math
        function calculate_trans() {
            //
            let useTTC = false;
            let useLocalTransit = false;
            console.log(times)
            if(isNaN(times)) {
                console.error('Error: Unable to parse times as an integer', times)
                return;
            }
            // Local temp variables to determine the fare assigned
            let fareindex = 0;
            let fareindex2 = 0;
            let fare = 0;

            if (localTransit === 'yes') {
                useLocalTransit = true;
            }

            if (ttc === 'yes') {
                useTTC = true;
            }

            // Loop to determine user's appropriate fare
            for (let line of trainstations) {
                for (let stationf of line) {
                    if (stationf === stop) { // Loop has found your train station
                        // Using the indexes previously declared it will generate a new list containing all the fares of your train line and subsequently find the fare corresponding to your station:
                        let fareline = fares[fareindex];
                        fare = fareline[fareindex2];
                    }
                    fareindex2 += 1;
                }
                fareindex += 1;
                fareindex2 = 0; // Reset the fareindex2 to 0 because it did not find a match in this train line
            }
            //
            console.log('raaan')
            // variables containing data
            let station = stop;
            times = (times * 2) * 4; // Calculate how many times a month user uses transportation based on inputted value
            let ttcfare = 2.25;
            let monthly_cost = 0; // Monthly cost is initialized as 0
            // The three following if/else account for all possible variants(ie. User takes the subway or not, uses local transit or not)
            // The way Go Transit calculates your fare is by the number is instances you use Go Train a month
            // If you use Go Train 1 to 30 times in a month you pay full fare
            // If you use Go Train between 31 and 40 times in a month your fare drops 91.84%
            // If you use Go Train more than 40 times you ride for free
            if (useTTC) {
                if (times <= 30) { // User rides less than 31 times a month so pays full fare
                    monthly_cost = fare * times + ttcfare * times;
                } else if (times > 30 && times <= 40) { // User rides between 31 and 40 times so those extra rides have 91.84% discount
                    monthly_cost = fare * 30 + (0.0816 * fare) * (times - 30) + ttcfare * times;
                } else { // User rides more than 40 times so rides the rest for free
                    monthly_cost = fare * 30 + (0.0816 * fare) * 10 + ttcfare * times;
                }
            } else if (station in toronto && useLocalTransit) {
                if (times <= 30) {
                    monthly_cost = fare * times + ttcfare * times;
                } else if (times > 30 && times <= 40) {
                    monthly_cost = fare * 30 + (0.0816 * fare) * (times - 30) + ttcfare * times;
                } else {
                    monthly_cost = fare * 30 + (0.0816 * fare) * 10 + ttcfare * times;
                }
            } else if (!useTTC) {
                if (times <= 30) {
                    monthly_cost = fare * times;
                } else if (times > 30 && times <= 40) {
                    monthly_cost = fare * 30 + (0.0816 * fare) * (times - 30);
                } else {
                    monthly_cost = fare * 30 + (0.0816 * fare) * 10;
                }
            }
            // Restate the train line and station user gets on, as well as how many times a month user goes to campus
            // Print final result of monthly_cost rounded to 2 decimals
            console.log(monthly_cost)
            console.log(`You will be spending $${monthly_cost.toFixed(2)} a month in transportation alone to get to campus`);
            return monthly_cost.toFixed(2);
        }

        // Call the function to calculate and print the result
        setMonthlyCost(calculate_trans());
        //

        /* try {
            const response = await axios.post('http://localhost:8080/api/home', form2Data, {
                headers: {
                'Content-Type': 'application/json',
                },
            });

            //Hail Mary
            const monthlyCost = response.data.monthly_cost;
            if(monthlyCost !== undefined) {
                console.log('Monthly Cost:', monthlyCost);
                setMonthlyCost(monthlyCost);
            }

            if (response.data.message === 'Form submitted succesfully') {
                console.log('Form Submitted succesfully');
            } else {
                console.error('Failed to submit form. Server response:', response.data);
            }
            } catch (error) {
                console.error('Error submitting form:', error);
            } */
    }

    //The following is to handle the return from the backend
    const [monthlyCost, setMonthlyCost] = useState(null);

    /*useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/home');

                //Set the monthly cost
                setMonthlyCost(response.data.monthly_cost);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);*/

    return (
        <div>
            {showFirstForm && (
                <div>
                    <h2>Which Train Line do you take?</h2>
                    <form onSubmit={handleForm1Submit}>
                        <label>
                            Select an option:
                            <select
                                value={form1Data.answer}
                                onChange={(e) => setForm1Data({ ...form1Data, answer: e.target.value })}
                            >
                                <option value="">Select...</option>
                                <option value="lke">Lakeshore East</option>
                                <option value="lkw">Lakeshore West</option>
                                <option value="bar">Barrie</option>
                                <option value="mil">Milton</option>
                                <option value="kit">Kitchener</option>
                                <option value="rch">Richmond Hill</option>
                                <option value="stv">Stouffville</option>
                            </select>
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
            {showSecondForm && (
                <div>
                    <form onSubmit={handleForm2Submit}>
                        {/*Form options will vary depending on what train line they selected in the first form */}
                        {form1Data.answer === 'lke' && (
                            <>
                            <label>
                                Select your local Go Train Station?
                                <select
                                    value={form2Data.stop}
                                    onChange={(e) => setForm2Data({ ...form2Data, stop: e.target.value})}
                                >
                                    {/* Stops go here */}
                                    <option value="">Select a Stop</option>
                                    <option value="Union">Union</option>
                                    <option value="Danforth">Danforth</option>
                                    <option value="Scarborough">Scarborough</option>
                                    <option value="Eglinton">Eglinton</option>
                                    <option value="Guildwood">Guildwood</option>
                                    <option value="Rouge Hill">Rouge Hill</option>
                                    <option value="Pickering">Pickering</option>
                                    <option value="Ajax">Ajax</option>
                                    <option value="Whitby">Whitby</option>
                                    <option value="Oshawa">Oshawa</option>
                                </select>
                            </label>
                            <label>
                                How many times a week do you go to TMU?
                                <input
                                    type='number'
                                    value={form2Data.times}
                                    onChange={(e) => setForm2Data({ ...form2Data, times: e.target.value })}
                                />
                            </label>
                            <label>
                                Do you take local transit to get to your local Go Station?
                                <select
                                    value={form2Data.localTransit}
                                    onChange={(e) => setForm2Data({ ...form2Data, localTransit: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            <label>
                                Do you take the TTC subway to get from Union Station to TMU campus?
                                <select
                                    value={form2Data.ttc}
                                    onChange={(e) => setForm2Data({ ...form2Data, ttc: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            </>
                        )}
                        {form1Data.answer === 'lkw' && (
                            <>
                            <label>
                                Select your local Go Train Station?
                                <select
                                    value={form2Data.stop}
                                    onChange={(e) => setForm2Data({ ...form2Data, stop: e.target.value})}
                                >
                                    <option value="">Select a Stop</option>
                                    {/*Stops go here*/}
                                    <option value="Union">Union</option>
                                    <option value="Exhibition">Exhibition</option>
                                    <option value="Mimico">Mimico</option>
                                    <option value="Long Branch">Long Branch</option>
                                    <option value="Port Credit">Port Credit</option>
                                    <option value="Clarkson">Clarkson</option>
                                    <option value="Oakville">Oakville</option>
                                    <option value="Bronte">Bronte</option>
                                    <option value="Appleby">Appleby</option>
                                    <option value="Burlington">Burlington</option>
                                    <option value="Aldershot">Aldershot</option>
                                    <option value="Hamilton">Hamilton</option>
                                </select>
                            </label>
                            <label>
                                How many times a week do you go to TMU?
                                <input
                                    type='number'
                                    value={form2Data.times}
                                    onChange={(e) => setForm2Data({ ...form2Data, times: e.target.value })}
                                />
                            </label>
                            <label>
                                Do you take local transit to get to your local Go Station?
                                <select
                                    value={form2Data.localTransit}
                                    onChange={(e) => setForm2Data({ ...form2Data, localTransit: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            <label>
                                Do you take the TTC subway to get from Union Station to TMU campus?
                                <select
                                    value={form2Data.ttc}
                                    onChange={(e) => setForm2Data({ ...form2Data, ttc: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            </>
                        )}
                        {form1Data.answer === 'bar' && (
                            <>
                            <label>
                                Select your local Go Train Station?
                                <select
                                    value={form2Data.stop}
                                    onChange={(e) => setForm2Data({ ...form2Data, stop: e.target.value})}
                                >
                                    <option value="">Select a Stop</option>
                                    {/*Stops go here*/}
                                    <option value="Union">Union</option>
                                    <option value="Downsview Park">Downsview Park</option>
                                    <option value="Rutherford">Rutherford</option>
                                    <option value="Maple">Maple</option>
                                    <option value="King City">King City</option>
                                    <option value="Aurora">Aurora</option>
                                    <option value="Newmarket">Newmarket</option>
                                    <option value="East Gwillimbury">East Gwillimbury</option>
                                    <option value="Bradford">Bradford</option>
                                    <option value="Barrie South">Barrie South</option>
                                    <option value="Allandale Waterfront">Allandale Waterfront</option>
                                </select>
                            </label>
                            <label>
                                How many times a week do you go to TMU?
                                <input
                                    type='number'
                                    value={form2Data.times}
                                    onChange={(e) => setForm2Data({ ...form2Data, times: e.target.value })}
                                />
                            </label>
                            <label>
                                Do you take local transit to get to your local Go Station?
                                <select
                                    value={form2Data.localTransit}
                                    onChange={(e) => setForm2Data({ ...form2Data, localTransit: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            <label>
                                Do you take the TTC subway to get from Union Station to TMU campus?
                                <select
                                    value={form2Data.ttc}
                                    onChange={(e) => setForm2Data({ ...form2Data, ttc: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            </>
                        )}
                        {form1Data.answer === 'mil' && (
                            <>
                            <label>
                                Select your local Go Train Station?
                                <select
                                    value={form2Data.stop}
                                    onChange={(e) => setForm2Data({ ...form2Data, stop: e.target.value})}
                                >
                                    <option value="">Select a Stop</option>
                                    {/*Stops go here*/}
                                    <option value="Union">Union</option>
                                    <option value="Kipling">Kipling</option>
                                    <option value="Dixie">Dixie</option>
                                    <option value="Cooksville">Cooksville</option>
                                    <option value="Erindale">Erindale</option>
                                    <option value="Streetsville">Streetsville</option>
                                    <option value="Meadowvale">Meadowvale</option>
                                    <option value="Lisgar">Lisgar</option>
                                    <option value="Milton">Milton</option>
                                </select>
                            </label>
                            <label>
                                How many times a week do you go to TMU?
                                <input
                                    type='number'
                                    value={form2Data.times}
                                    onChange={(e) => setForm2Data({ ...form2Data, times: e.target.value })}
                                />
                            </label>
                            <label>
                                Do you take local transit to get to your local Go Station?
                                <select
                                    value={form2Data.localTransit}
                                    onChange={(e) => setForm2Data({ ...form2Data, localTransit: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            <label>
                                Do you take the TTC subway to get from Union Station to TMU campus?
                                <select
                                    value={form2Data.ttc}
                                    onChange={(e) => setForm2Data({ ...form2Data, ttc: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            </>
                        )}
                        {form1Data.answer === 'kit' && (
                            <>
                            <label>
                                Select your local Go Train Station?
                                <select
                                    value={form2Data.stop}
                                    onChange={(e) => setForm2Data({ ...form2Data, stop: e.target.value})}
                                >
                                    <option value="">Select a Stop</option>
                                    {/*Stops go here*/}
                                    <option value="Union">Union</option>
                                    <option value="Bloor">Bloor</option>
                                    <option value="Weston">Weston</option>
                                    <option value="Etobicoke North">Etobicoke North</option>
                                    <option value="Malton">Malton</option>
                                    <option value="Bramalea">Bramalea</option>
                                    <option value="Brampton">Brampton</option>
                                    <option value="Mount Pleasant">Mount Pleasant</option>
                                    <option value="Georgetown">Georgetown</option>
                                    <option value="Acton">Acton</option>
                                    <option value="Guelph Central">Guelph Central</option>
                                    <option value="Kitchener">Kitchener</option>
                                </select>
                            </label>
                            <label>
                                How many times a week do you go to TMU?
                                <input
                                    type='number'
                                    value={form2Data.times}
                                    onChange={(e) => setForm2Data({ ...form2Data, times: e.target.value })}
                                />
                            </label>
                            <label>
                                Do you take local transit to get to your local Go Station?
                                <select
                                    value={form2Data.localTransit}
                                    onChange={(e) => setForm2Data({ ...form2Data, localTransit: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            <label>
                                Do you take the TTC subway to get from Union Station to TMU campus?
                                <select
                                    value={form2Data.ttc}
                                    onChange={(e) => setForm2Data({ ...form2Data, ttc: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            </>
                        )}
                        {form1Data.answer === 'rch' && (
                            <>
                            <label>
                                Select your local Go Train Station?
                                <select
                                    value={form2Data.stop}
                                    onChange={(e) => setForm2Data({ ...form2Data, stop: e.target.value})}
                                >
                                    <option value="">Select a Stop</option>
                                    {/*Stops go here*/}
                                    <option value="Union">Union</option>
                                    <option value="Old Cummer">Old Cummer</option>
                                    <option value="Langstaff">Langstaff</option>
                                    <option value="Richmond Hill">Richmond Hill</option>
                                    <option value="Gormley">Gormley</option>
                                    <option value="Bloomington">Bloomington</option>
                                </select>
                            </label>
                            <label>
                                How many times a week do you go to TMU?
                                <input
                                    type='number'
                                    value={form2Data.times}
                                    onChange={(e) => setForm2Data({ ...form2Data, times: e.target.value })}
                                />
                            </label>
                            <label>
                                Do you take local transit to get to your local Go Station?
                                <select
                                    value={form2Data.localTransit}
                                    onChange={(e) => setForm2Data({ ...form2Data, localTransit: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            <label>
                                Do you take the TTC subway to get from Union Station to TMU campus?
                                <select
                                    value={form2Data.ttc}
                                    onChange={(e) => setForm2Data({ ...form2Data, ttc: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            </>
                        )}
                        {form1Data.answer === 'stv' && (
                            <>
                            <label>
                                Select your local Go Train Station?
                                <select
                                    value={form2Data.stop}
                                    onChange={(e) => setForm2Data({ ...form2Data, stop: e.target.value})}
                                >
                                    <option value="">Select a Stop</option>
                                    {/*Stops go here*/}
                                    <option value="Union">Union</option>
                                    <option value="Kennedy">Kennedy</option>
                                    <option value="Agincourt">Agincourt</option>
                                    <option value="Milliken">Milliken</option>
                                    <option value="Unionville">Unionville</option>
                                    <option value="Centennial">Centennial</option>
                                    <option value="Markham">Markham</option>
                                    <option value="Mount Joy">Mount Joy</option>
                                    <option value="Stouffville">Stouffville</option>
                                    <option value="Old Elm">Old Elm</option>
                                </select>
                            </label>
                            <label>
                                How many times a week do you go to TMU?
                                <input
                                    type='number'
                                    value={form2Data.times}
                                    onChange={(e) => setForm2Data({ ...form2Data, times: e.target.value })}
                                />
                            </label>
                            <label>
                                Do you take local transit to get to your local Go Station?
                                <select
                                    value={form2Data.localTransit}
                                    onChange={(e) => setForm2Data({ ...form2Data, localTransit: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            <label>
                                Do you take the TTC subway to get from Union Station to TMU campus?
                                <select
                                    value={form2Data.ttc}
                                    onChange={(e) => setForm2Data({ ...form2Data, ttc: e.target.value})}
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                            </>
                        )}

                        <button type="submit">Submit Form</button>
                    </form>
                </div>
            )}
            <div>
                {monthlyCost !== null ? (
                    <div className='container-400'>
                        <h2>Summary:</h2>
                        <p>Based on the information entered, you use the {form1Data.answer} line and get on {form2Data.stop} station.</p>
                        <p>You go to TMU a total of {form2Data.times*8} times a month.</p>
                        <br/>
                        <p>You will be spending ${monthlyCost} a month in transportation alone to get to campus.</p>
                    </div>
                ) : (
                    <br/>
                )}
            </div>
        </div>
    );

};

export default FormSubmission;