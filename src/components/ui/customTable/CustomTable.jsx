import React from 'react';
import './CustomTable.scss';
import { icons } from '../../../constants';

const CustomTable = ({ data }) => {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Relation</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td className="avatar">
                                <div className="circle"></div>
                            </td>
                            <td>{row.name}</td>
                            <td>{row.age}</td>
                            <td>{row.gender}</td>
                            <td>{row.relation}</td>
                            <td>
                                <div className="icon"><img src={icons.eyeHalf} alt="" /></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomTable