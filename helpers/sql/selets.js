/**
 * Este archivo contiene todas la funciones SQL
 * table =  Esta parametro contiene el nombre de la tabla
 * where = El tipo de validacion SQL
 */

const sql = require('../../config/db/codeSql');

// Esta es la funcion que realiza la consulta para todos las funciones
async function globalConsult(codeSql){
    const query_consult = await sql(codeSql);
    return query_consult;
}

// Esta funcion genera todos los selects
async function selectQuery(table, where, selectParams = "COUNT(*)"){
    const codeSql = `SELECT ${selectParams} FROM ${table} WHERE ${where}`;
    return await globalConsult(codeSql);
}

// Esta funcion genera todos los updates
async function updateQuery(table, where, set){
    const codeSql = `UPDATE ${table} SET ${set} WHERE ${where}`;
    return await globalConsult(codeSql); 
}

// Esta funcion genera todos los inserts
async function insertQuery(table, columns, values){
    const codeSql = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
    return await globalConsult(codeSql);
}

// Esta funcion elimina los items no necesarios

async function deleteQuery(table, value){
    const codeSQL = `DELETE FROM ${table} WHERE ${value}`;
    return await globalConsult(codeSQL);
}

module.exports = {
    selectQuery,
    updateQuery,
    insertQuery,
    deleteQuery
}