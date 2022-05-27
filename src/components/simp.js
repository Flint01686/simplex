const initArr = (count_rows, count_col) => {
    let res_arr = Array(count_rows)
    for(let i = 0; i < count_rows; i++){
        res_arr[i] = Array(count_col)
    }
    return res_arr
}

const toCanonicalForm = (count_vars, main_func, conds) => {
    let counter_additional_vars = 0
    //В начале проверяем какого характера у нас функция, нужно, чтобы была max
    //Каноничной форма считается с характером max и неравенствами со знаком <=
    if(main_func['char'] === 'min'){ //проверяем функцию на характер max
        for(let key in main_func){
            if(key !== 'char'){
                main_func[key] *= -1
            }
        }
        main_func['char'] = 'max'
    }  

    for (let i in conds){
        if (conds[i]['sign'] === '<='){
            counter_additional_vars++// To do: кривенький приёмчик
            conds[i][`x${counter_additional_vars + count_vars['count_vars']}`] = 1 //установка балансовых переменных в условия
            main_func[`x${counter_additional_vars + count_vars['count_vars']}`] = 0  //установка балансовых переменных в целевую функ.  
        }

        if (conds[i]['sign'] === '>='){ // если уравнение не каноничное, то умножаем все его части на -1 и меняем знак
            counter_additional_vars++// To do: кривенький приёмчик
            for(let key in conds[i]){
                if(key !== 'sign'){
                    conds[i][key] *= -1
                }
            }
            conds[i]['sign'] = '<='
            conds[i][`x${counter_additional_vars + count_vars['count_vars']}`] = 1 
            main_func[`x${counter_additional_vars + count_vars['count_vars']}`] = 0  //установка балансовых переменных в целевую функ.
        }

        conds[i]['sign'] = '='  //переход к канон форме
        
    }

    let count_cell_for_matrix = counter_additional_vars + count_vars['count_vars'] + 1 

    let extended_matrix = initArr(count_vars['count_condition'], count_cell_for_matrix) // инициализируем матрицу под нулевую итерацию

    for (let i in conds){ //заполняем её значениями из даты
        for( let j = 0; j < count_cell_for_matrix; j++){
            if (j < count_cell_for_matrix - 1)
                extended_matrix[i - 1][j] = conds[i][`x${j+1}`] === undefined ? 0 : conds[i][`x${j+1}`]
            if (j === count_cell_for_matrix - 1)
                extended_matrix[i - 1][j] = conds[i][`b`]
        }
            
    }
    return {'extended_matrix': extended_matrix, 'main_func': main_func, 'conds': conds}
}

const get_z_values = (matrix, main_func, basis_vars) => { // высчитываем z значения для матрицы 
    let z = []
    for(let j = 0; j < matrix[0].length; j++){
        let sum = 0;
        for(let i = 0; i < matrix.length; i++){
            sum += matrix[i][j] * main_func[basis_vars[i]] //TO DO: А если получится так, что базисные переменные в массиве будут не по порядку?
        }
        if(j !== matrix[0].length - 1)
            sum -= main_func[`x${j+1}`]
        z.push(sum)
    }
    return z;
}

const get_min_from_iteration = (matrix, index_col_supp_elem) =>{ // определяем столбец min, чтобы из него выбрать наименьший элемент, для определения направляющей строки
    let arr = []
    for(let i = 0; i < matrix.length; i++){
        arr[i] = (matrix[i][matrix[i].length - 1] / matrix[i][index_col_supp_elem]) // b / elem matrix with min z_value
    }
    
    return arr
}

const getIndexMinZ = (array) => { // определяем индекс мин. элемента в массиве
    let min = Math.min(...array)
    return array.indexOf(min)
}
const getIndexPlusMin = (array) => { // определяем индекс мин. неотрицательный элемент в массиве
    let min_plus = 99999
    for(let i in array){
        if (array[i] > 0 && array[i]< min_plus)
            min_plus=array[i]
    }
    if (min_plus === 99999)
        return undefined
    return array.indexOf(min_plus)
}

const check_z_values = (z_values) =>{ // проверяем получен ли оптимальный план (для ->max все значения не отрицательные)
    for (let key in z_values){
        if(z_values[key] < 0)
            return false
    } 
    return true
} 

const get_new_elem_jordan_gauss = (matrix,index_y_supp_elem, index_x_supp_elem, index_y_current_elem, index_x_current_elem) =>{
    let current_item = matrix[index_y_current_elem][index_x_current_elem]
    let supp_item = matrix[index_y_supp_elem][index_x_supp_elem]
    let first_diag_item = matrix[index_y_current_elem][index_x_supp_elem]
    let second_diag_item = matrix[index_y_supp_elem][index_x_current_elem]
    return current_item - (first_diag_item * second_diag_item) / supp_item  // какая-то хуйня, справа от опорного не считает
}

const recalcMatrixJordansMethod = (matrix, index_y_supp_elem, index_x_supp_elem) => {
    let prev_matrix = get_clone_arr_arr(matrix)
    let supp_elem = prev_matrix[index_y_supp_elem][index_x_supp_elem]
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[0].length; j++){       
            if(i === index_y_supp_elem){
                matrix[i][j] = matrix[i][j] / supp_elem  // делим строку с направляющим элементом на направляющий элемент
            }  
            else
            {
                matrix[i][j] = get_new_elem_jordan_gauss(prev_matrix,index_y_supp_elem,index_x_supp_elem,i, j)
            } 
        }
    }
}

const get_clone_arr_arr = (arrArr) => {
    let resArr = Array(arrArr.length)
    for (let i in arrArr){
        resArr[i] = Array(arrArr[i].length)
        for(let j in arrArr[i])
            resArr[i][j] = arrArr[i][j]
    }
    return resArr
}

let log_arr = (arrArr) =>{
    let str=''
    for(let i in arrArr){
        for(let j in arrArr[i])
            str += `${arrArr[i][j]} \t`
        str += '\n'
    }
    return str
} 

let check_matrix_for_presence_unit_matrix = (matrix) =>{ 
    /**
     * Проверяет матрицу на наличие единичной матрицы, 
     * в случае наличия возвращает массив из 2ух элем.,где 0ой - bool с подтверждением того, что единичная матрица есть
     * а 1ый c индексами Х выбранных базисов
     */
    
    //create_unit_matrix
    let temp_indexs_x_basis_vars = []
    let unit_matrix = initArr(matrix.length, matrix.length)
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix.length; j++){
            unit_matrix[i][j] = j === i ? 1 : 0
        }       
    }

    /**
     * крч, определяем единичную матрицу внутри массива массивов следующим образом
     * Транспонируем исходную матрицу и ищем в ней строки как в созданной выше единичной матрице, если есть такая строка, то это наш будущий базис
     * Если базис найден, то переходим к поиску следующего за счет конструкции continue outer
     */

    //TO DO: Не уверен в правильности логики этого алгоритма
    let transp_matrix = matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c])) // транспонирует массив

    outer: for(let j in unit_matrix){ //
        for(let i in transp_matrix){
            if(transp_matrix[i].toString() === unit_matrix[j].toString()){
                temp_indexs_x_basis_vars.push(+i)
                continue outer;
            }     
        }
    }
    //TO DO: Может оказаться так, что столбцов расш. матрицы, удовлетворяющих требованиям для выбора базисной переменной может быть больше,
    // Чем нужно(matrix.length), с этим надо будет что-то сделать
    if(temp_indexs_x_basis_vars.length === matrix.length)
        return [true, temp_indexs_x_basis_vars]
    return [false, temp_indexs_x_basis_vars]
} 

let choose_basis_vars = (extended_matrix, main_func) =>{
    let basis_vars = []
    let is_there_unit_matrix = check_matrix_for_presence_unit_matrix(extended_matrix)
    if (is_there_unit_matrix[0]){
        for(let i in is_there_unit_matrix[1]){
            basis_vars.push(`x${is_there_unit_matrix[1][i] + 1}`)
        }
    }
    else { 
    /** 
     * Если у нас не получилось единичной матрицы, элементы которой можно взять за базисные
     * при переходе к канонической форме, то в таком случае нам будет нужно самим выбрать 
     * TO DO : Придумать как их выбирать, а пока пусть будут х3 х4 х5 для примера
     * Чтобы сделать переменные базовыми(базисными) нам нужно получить значение 1 на её месте,
     * Для этого будем пересчитывать расширенную матрицу методом Жордана-Гаусса
     */
        if(basis_vars.length !== 0)
            for(let i in is_there_unit_matrix[1]){
                basis_vars.push(`x${is_there_unit_matrix[1][i] + 1}`)
            }


        let temp_for_example_basis_vars = [2, 3, 4] // временное решение
        for(let i in temp_for_example_basis_vars){
            basis_vars.push(`x${temp_for_example_basis_vars[i] + 1}`)
        }

        
        for(let i = 0; i < extended_matrix.length; i++){//пересчёт жордан-гауссом всех строк для получения единичной матрицы
            recalcMatrixJordansMethod(extended_matrix, i, temp_for_example_basis_vars[i])
        }

        //TO DO: Вынести в отдельную функцию
        //Нужно выразить базисные переменные через остальные и подставить их в целевую функцию, чтобы пересчитать её
        let temp_temp = {}
        for(let i = 0; i < extended_matrix.length; i++){  //собираем данные в объект
            let temp = {}
            for(let j = 0; j < extended_matrix[i].length; j++){
                if(j !== extended_matrix[i].length - 1){
                    if(extended_matrix[i][j] !== 0)
                        temp[`x${j+1}`]=extended_matrix[i][j]
                }     
                else{
                    temp[`b`] = extended_matrix[i][j]
                }     
            }
            temp_temp[basis_vars[i]] = temp
        }

        for(let basis_var in temp_temp){ // выражаем базисные пременные через остальные
            for(let _var in temp_temp[basis_var]){
                if(_var !== basis_var && _var !== 'b'){
                    temp_temp[basis_var][_var] *= -1
                }
            }
            delete temp_temp[basis_var][basis_var]
        }

        for(let basis_var in temp_temp) {// умножаем полученные выше выраженные базисные переменные на коэфы из цел. функции
            if(basis_var in main_func){
                for(let _var in temp_temp[basis_var]){
                    temp_temp[basis_var][_var] *= main_func[basis_var]
                }
                    
            }
        }
        
        let new_main_func = {}
        var keys = Object.keys(temp_temp);
        for(let _var in temp_temp[keys[0]]){  //собираем данные в объект
            let sum = 0
            for(let basis_var in temp_temp){
               sum += temp_temp[basis_var][_var]
            }
            new_main_func[_var] = sum
        }

        for(let key in temp_temp){  //Ааааааааааааааа
            new_main_func[key] = 0
        }
        
        for(let key in new_main_func){  //Аааааааааааааааааааааа памагииитее,что я творю?!?!? Если бог есть, то мне НЕСДОБРОВАТЬ
            if(key !== 'b')
                main_func[key] = new_main_func[key]
            else{
                main_func['c'] = new_main_func[key]
            }
        }

    }
    return basis_vars
}


const solve_simplex = (count_vars, data) => {
    let report = ``
    report += `Целевая функция F=${JSON.stringify(data['main_func'])}\n`
    report += `Условия:\n ${log_arr(data['conditions'])}`

    let cannonicalForm = toCanonicalForm(count_vars, data['main_func'], data['conditions'])
    let extended_matrix = cannonicalForm['extended_matrix']
    let main_func = cannonicalForm['main_func']
    let conds = cannonicalForm['conds']

    let basis_vars = choose_basis_vars(extended_matrix, main_func);
    let z_values = get_z_values(extended_matrix,main_func,basis_vars)

    report += '___________________________________\n'
    report += 'КАНОНИЧНАЯ ФОРМА\n'
    report += `Целевая функция F=${JSON.stringify(main_func)}\n`
    report += `Условия:\n ${log_arr(conds)}\n`

    report += 'Выберем базисные переменные:\n'
    report += basis_vars.toString()

    report += `\nРасширенная матрица коэффициентов\n`
    report += log_arr(extended_matrix)

    report += '\nПолученные Z значения:\n'
    report += z_values.toString()

    let counter_ineration = 0
    let is_solved = true
    let iteration_matrix = get_clone_arr_arr(extended_matrix)
    while(!check_z_values(z_values)){ //пока не достигнут оптимальный план
        report += `\nИтерация №${counter_ineration+1}\n`
        let index_x_supp_elem = getIndexMinZ(z_values)
        let min_iteration = get_min_from_iteration(iteration_matrix,index_x_supp_elem)
        report +=`Столбец MIN:\n`
        report += min_iteration.toString()
        let index_y_supp_elem = getIndexPlusMin(min_iteration)

        if (index_y_supp_elem === undefined){
            report += `\nВ столбце MIN отсутствуют положительные значения, невозможно выбрать направляющий элемент, решений нет.`
            is_solved = false
            break;
        }
        
        report += `\nОпорный элемент ${index_y_supp_elem} ${index_x_supp_elem} = ${iteration_matrix[index_y_supp_elem][index_x_supp_elem]}\n`  
        basis_vars[index_y_supp_elem] = `x${index_x_supp_elem + 1}` // обновляем массив с базисными переменными
        report += 'Базисные переменные:\n'
        report += basis_vars.toString()

        recalcMatrixJordansMethod(iteration_matrix, index_y_supp_elem, index_y_supp_elem)
        z_values = get_z_values(iteration_matrix,main_func,basis_vars)

        report += `\nПерестроенная матрица\n`
        report += log_arr(iteration_matrix)
        report += `Полученные Z значения\n`
        report += z_values.toString()
        report +=`\n___________________________________\n`
        counter_ineration++
    }

    if(is_solved){
        report += `\nВсе симплекс-разности не отрицательны, достигнут оптимальный план:\n`
        for(let i in basis_vars){
            report += `${basis_vars[i]}: ${iteration_matrix[i][iteration_matrix[i].length - 1]}\n`
        }
    }
    
    return report
}
// console.log(solve_simplex())
export default solve_simplex
