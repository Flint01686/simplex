import './Simplex_method.css'
import Chooser_values_func_condition from './Chooser_values_func_condition'
import Chooser_count_vars_conditions from './Chooser_count_vars_conditions'
import Chooser_form_solution from './Chooser_form_solution'
import { useState, useEffect } from 'react';

import solve_simplex from './simp'

const Simplex_method = () => {
    const [countVarsConds, setCountVarsConds] = useState(
        {
            count_vars: 2,
            count_condition: 2
        }
    )
    
    const [dataForm, setDataForm] = useState(
        {
            
            main_func: {
                'x1':0,
                'x2':0,
                'c':0,
                'char': 'min'
            },
            conditions: {
                1: {
                    'x1': 0,
                    'x2': 0,
                    'sign': '<=',
                    'b':0
                },
                2: {
                    'x1': 0,
                    'x2': 0,
                    'sign': '<=',
                    'b':0
                },
            },
            form_solution: 1
        }
    )

    const [solution, setSolution] = useState('')

    useEffect(() => {
        InitContainerForForm()
    }, [countVarsConds])
    console.log(countVarsConds, dataForm)

    const setKeyValueCountVarsConds = (key, value) =>{
        let clonCountVarsConds = {...countVarsConds};
        clonCountVarsConds[key] = +value;
        setCountVarsConds(clonCountVarsConds)
        
    }

    const setKeyValueDataForm = (key, value) =>{
        let clonDataForm = {...dataForm};
        clonDataForm[key] = value;
        setDataForm(clonDataForm)
    }
    
    const InitContainerForForm = () => {
        let mainFunc = {}
        
        for(let i=0; i < countVarsConds['count_vars'] + 2; i++){
            if(i === countVarsConds['count_vars'])
                mainFunc['c'] = 0;
            if(i === countVarsConds['count_vars'] + 1)
                mainFunc['char'] = 'min';
            if(i < countVarsConds['count_vars'])
                mainFunc[`x${i+1}`] = 0;
        }

        let conditions = {}
        for(let i = 0; i < countVarsConds['count_vars'] + 2; i++){
            for(let j = 0; j < countVarsConds['count_condition']; j++){
                //TO DO: не выправляются условия в стейте при изменеии количества переменных
            }
        }
        
        setKeyValueDataForm('main_func', mainFunc)
    }

    const change_value_selector = (event, selector_name) =>{
        setKeyValueCountVarsConds(selector_name, event.target.value)
    }

    const change_value_cell_main_func = (event, key_main_func) =>{
        let clonDataForm = {...dataForm};
        clonDataForm['main_func'][key_main_func] = event.target.value;
        setDataForm(clonDataForm)
    }

    const change_value_cell_condition = (event, numb_cond, key_value) =>{
        let clonDataForm = {...dataForm};
        if (clonDataForm['conditions'][numb_cond] === undefined)
            clonDataForm['conditions'][numb_cond] = {}
                 
        clonDataForm['conditions'][numb_cond][key_value]= event.target.value;
        setDataForm(clonDataForm)
    }

    const change_form_solution = (event) => {
        setKeyValueDataForm('form_solution', event.target.value)
    }

    const solve_task = () => {
        setSolution(solve_simplex({...countVarsConds}, {...dataForm})) // TO DO: из-за ссылочности объектов функция изменяет стейт
    }

    return (
        <div className="container simplex_method">
            <Chooser_count_vars_conditions change_value_selector={change_value_selector}/>
            <Chooser_values_func_condition 
                count_vars={countVarsConds['count_vars']} 
                count_condition={countVarsConds['count_condition']}
                change_value_cell_main_func ={change_value_cell_main_func}
                change_value_cell_condition = {change_value_cell_condition}
            />
            <Chooser_form_solution 
                change_form_solution = {change_form_solution}
            />
            <div className="field_btn_get_solution">
                <button className='btn_get_solution' onClick={solve_task}>Рассчитать</button>
            </div>
            {
                solution ? (
                    <div className="report_solution">
                        {solution}
                    </div>
                ) :
                (undefined)
            }
        </div>
    )
}


export default Simplex_method;
