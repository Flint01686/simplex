 import './Chooser_form_solution.css'

const Chooser_form_solution = ({change_form_solution}) => {
    return(
        <div className="chooser_form_solution">
            <label>Форма решения симплекс-метода</label>
            <select name="" id="" onChange={(event) => {change_form_solution(event)}}>
                <option value="1">Базовый симплекс-метод</option>
            </select>
        </div>
    )
}

export default Chooser_form_solution;