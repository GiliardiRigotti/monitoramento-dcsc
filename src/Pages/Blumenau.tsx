import React, { useCallback, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { gql, useQuery } from '@apollo/client';
import axios from 'axios';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale);

enum TipoEstacao {
    HIDRO = "Hidro",
    METEO = "Meteo",
    PLUVIO = "Pluvio",
    BARRAGEM = "Barragem",
}

type Estacao = {
    nome?: string;
    tipo?: TipoEstacao;
    codigo?: string;
    last_read?: string;
    nivel_rio?: number;

    nivel_rio_historico?: Array<{ t_stamp: string; nivel: number }>;

    chuva_001h?: number;
    chuva_003h?: number;
    chuva_006h?: number;
    chuva_012h?: number;
    chuva_024h?: number;
    chuva_048h?: number;
    chuva_072h?: number;
    chuva_096h?: number;
    chuva_120h?: number;
    chuva_144h?: number;
    chuva_168h?: number;

    temp_atual?: number;
    temp_sens?: number;
    umidade?: number;

    vel_vento?: number;
    dir_vento?: number;
    pres_atmos?: number;

    localizacao?: {
        lat: number;
        lng: number;
    };

    nivel_montante?: number;
    nivel_jusante?: number;
    porc_reservatorio?: number;
    comp_abertas?: number;
    comp_fechadas?: number;
};

type Data = {
    local: string,
    labels: string[],
    data: number[]
}


export function Blumenau() {
    const [labelsBlumenau, setLabelsBlumenau] = useState<string[]>([])
    const [dataBlumenau, setDataBlumenau] = useState<number[]>([])

    async function getApiBlumenau() {
        const listLabel: string[] = []
        const listData: number[] = []
        const response = await axios.get("https://api.itajai.sc.gov.br/enchente/rios-blumenau", {})
        response.data.niveis.forEach((item: { nivel: number, horaLeitura: string }) => {
            const date = `${new Date(item.horaLeitura).getDate() < 10 ? '0' + new Date(item.horaLeitura).getDate() : new Date(item.horaLeitura).getDate()}/${(new Date(item.horaLeitura).getMonth() + 1) < 10 ? '0' + (new Date(item.horaLeitura).getMonth() + 1) : (new Date(item.horaLeitura).getMonth() + 1)} - ${new Date(item.horaLeitura).getHours() < 10 ? '0' + new Date(item.horaLeitura).getHours() : new Date(item.horaLeitura).getHours()}:${new Date(item.horaLeitura).getMinutes() < 10 ? '0' + new Date(item.horaLeitura).getMinutes() : new Date(item.horaLeitura).getMinutes()}`
            listLabel.push(date)
            listData.push(item.nivel)
        })
        setLabelsBlumenau(listLabel)
        setDataBlumenau(listData)
    }

    useEffect(() => {
        setTimeout(function () {
            window.location.reload();
        }, 300000);
        getApiBlumenau()
    }, [])

    return (
        <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 1000, height: 500 }}>
                <Line
                    options={{
                        scales: {
                            y: {
                                border: {
                                    display: false
                                },
                                grid: {
                                    color: function (context) {
                                        if (context.tick.value === 8.0) {
                                            return 'red';
                                        }
                                        return '#e5e5e5';
                                    },
                                },
                            }
                        }
                    }}
                    data={{
                        labels: labelsBlumenau,
                        datasets: [
                            {
                                data: dataBlumenau,
                                label: "Nivel Rio Itajaí-Açu - Blumenau (Atualizado à cada hora) - Fonte: AlertaBlu"
                            },
                        ],
                    }} />
            </div>
        </div>
    )
}

