import './Chooser_values_func_condition.css'


const Chooser_values_func_condition = (
        {
            count_vars, 
            count_condition, 
            change_value_cell_main_func,
            change_value_cell_condition
        }
    ) => {
        
    var result_content = new Array(count_condition + 1) // +1 - т.е. + место под целевую функцию

    for(var i = 0; i < result_content.length; i++){
        result_content[i] = new Array(count_vars + 2)  // +2 т.е. под знак условия(>=,=,<=), и под вторую часть условия x1+x2<=5

        for(var j = 0; j < result_content[i].length; j++){
            if(i === 0){ // main func
                if(j < result_content[i].length - 2) // для x-значений в целевой функции
                    result_content[i][j] = (
                        <Сhooser_values_main_func_cell 
                            key={j} 
                            key_value = {`x${j+1}`}
                            change_value_cell = {change_value_cell_main_func} 
                            str_label={`x${j+1}`}
                        />
                )
            
                if(j === result_content[i].length - 2) // для C в целевой функции
                    result_content[i][j] = (
                        <Сhooser_values_main_func_cell 
                            key={j} 
                            key_value = {`c`}
                            change_value_cell = {change_value_cell_main_func}
                            str_label={`С`}
                        />
                    )  
                
                if(j === result_content[i].length - 1) // для выбора функции(max,min) в целевой функции
                    result_content[i][j] = (
                        <Chooser_charakter_main_func 
                            key={j}
                            key_value = {`char`}
                            change_value_cell = {change_value_cell_main_func}
                        />
                    )   
                    
            }
            else {  // conditions
                if(j < result_content[i].length - 2) // для x-значений в условиях
                    result_content[i][j] = (
                        <Сhooser_values_conditions_cell 
                            key={j} 
                            num_cond = {i}
                            key_value = {`x${j+1}`}
                            change_value_cell = {change_value_cell_condition}
                            str_label={`x${j+1}`}
                        />
                    )
            
                if(j === result_content[i].length - 2) // для знака в условиях
                    result_content[i][j] = (
                        <Сhooser_sign_conditions_cell 
                            num_cond = {i}
                            key_value = {`sign`}
                            change_value_cell = {change_value_cell_condition}
                            key={j}
                        />
                    )
                
                if(j === result_content[i].length - 1) // для В-значения в условиях
                    result_content[i][j] = (
                        <Сhooser_values_conditions_cell
                            num_cond = {i}
                            key_value = {`b`}
                            change_value_cell = {change_value_cell_condition} 
                            key={j}
                        />
                    )          
            }   
        }
    }

    return(
        <div className="container chooser_values_form">
            {
                result_content.map((value, index_i) => {
                    if(index_i === 0)
                        return(
                            <>
                                <div style={{marginBottom: "10px"}} className="objective_func">
                                    Целевая функция:
                                </div>
                            <div key={index_i} className='chooser_values_form_row'>
                                {
                                    value.map((values, index_y) => {
                                        return(
                                        values
                                        )
                                    }
                                    )
                                }
                            </div>  
                            </>
                            
                        )
                    return(
                        <div key={index_i} className='chooser_values_form_row'>
                            {
                                value.map((values, index_y) => {
                                    return(
                                    values
                                    )
                                }
                                )
                            }
                        </div>
                        )
                })
            }
        </div>
    ) 
}

const Сhooser_values_main_func_cell = ({str_label, key_value, change_value_cell}) => {
    return(
        <div className='chooser_values_form_cell'>
            <input type="text" className='chooser_values_form_input'
                placeholder='0'
                onChange={(event) => {
                    change_value_cell(event, key_value)
                    }
                }
            />
            <label className='chooser_values_form_label'>{str_label}</label>
        </div>
    )
}

const Chooser_charakter_main_func = ({key_value, change_value_cell}) => {
    return(
        <div className='chooser_values_form_cell'>
            <select name="" className='chooser_values_form_input' onChange={(event) => {change_value_cell(event, key_value)}}>
                <option value={'min'}>{'min'}</option>
                <option value={'max'}>{'max'}</option>
            </select>
        </div>
    )
}

const Сhooser_values_conditions_cell = ({num_cond, key_value, str_label, change_value_cell}) => {
    return(
        <div className='chooser_values_form_cell'>
            <input type="text" className='chooser_values_form_input' 
                placeholder='0'
                onChange={(event) => {
                    change_value_cell(event, num_cond, key_value)
                    }
                }
            />
            <label className='chooser_values_form_label'>{str_label}</label>
        </div>
    )
}

const Сhooser_sign_conditions_cell = ({num_cond, key_value, change_value_cell}) => {
    return(
        <div className='chooser_values_form_cell'>
            <select name="" className='chooser_values_form_input' 
                onChange={ (event) => { change_value_cell(event, num_cond, key_value) } }
            >
                <option value={'<='}>{'≤'}</option>
                <option value={'='}>{'='}</option>
                <option value={'>='}>{'≥'}</option>
            </select>
        </div>
    )
}


export default Chooser_values_func_condition;