import './Chooser_count_vars_conditions.css'

import React from 'react'

const Chooser_count_vars_conditions = ({change_value_selector}) => {
    return(
        <div className="chooser_count_vars_conditions">
            <div className="chooser_count_vars_conditions_item">
                <label>Kоличество переменных</label>
                <select className="kolPR" size="1" onChange={(event) => change_value_selector(event,'count_vars')}>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>
            <div className="chooser_count_vars_conditions_item">
                <label>Количество строк (количество ограничений)</label>
                <select className="kolPR" size="1" onChange={(event) => change_value_selector(event,'count_condition')}>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>
        </div>
    );
}


export default Chooser_count_vars_conditions