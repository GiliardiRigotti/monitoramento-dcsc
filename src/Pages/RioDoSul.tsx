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


export function RioDoSul() {
    const [estacoes, setEstacao] = useState<Estacao[]>([])
    const [labels, setLabels] = useState<string[]>([])
    const [data, setData] = useState<number[]>([])


    const GET_ESTACOES = gql`
  query ListaEstacoes {
    estacoes {
      nome
      codigo
      tipo
      last_read

      localizacao {
        lat
        lng
      }

      nivel_rio
      nivel_rio_historico {
        t_stamp
        nivel
      }

      chuva_001h
      chuva_003h
      chuva_006h
      chuva_012h
      chuva_024h
      chuva_048h
      chuva_072h
      chuva_096h
      chuva_120h
      chuva_144h
      chuva_168h

      temp_atual
      temp_sens
      umidade
      vel_vento
      dir_vento
      pres_atmos

      nivel_montante
      nivel_jusante
      porc_reservatorio
      comp_abertas
      comp_fechadas
    }
  }
`;

    const updateEstacoes = (
        (data: { estacoes: Estacao[] }) => {
            setEstacao(data.estacoes)
        }
    );

    useQuery(GET_ESTACOES, {
        onError: () => { },
        onCompleted: updateEstacoes,
        fetchPolicy: "network-only",
    });


    useEffect(() => {
        setTimeout(function () {
            window.location.reload();
        }, 300000);
        if (estacoes.length > 0) {
            const listLabel: string[] = []
            const listData: number[] = []
            const brusqueData = estacoes.filter((item) => item.nome == "DCSC Rio do Sul")
            brusqueData[0].nivel_rio_historico?.forEach((item) => {
                const date = `${new Date(item.t_stamp).getDate() < 10 ? '0' + new Date(item.t_stamp).getDate() : new Date(item.t_stamp).getDate()}/${(new Date(item.t_stamp).getMonth() + 1) < 10 ? '0' + (new Date(item.t_stamp).getMonth() + 1) : (new Date(item.t_stamp).getMonth() + 1)} - ${new Date(item.t_stamp).getHours() < 10 ? '0' + new Date(item.t_stamp).getHours() : new Date(item.t_stamp).getHours()}:${new Date(item.t_stamp).getMinutes() < 10 ? '0' + new Date(item.t_stamp).getMinutes() : new Date(item.t_stamp).getMinutes()}`
                listLabel.push(date)
                listData.push(item.nivel)
            })
            setLabels(listLabel)
            setData(listData)
        }
    }, [estacoes])

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
                                        if (context.tick.value === 6.0) {
                                            return 'red';
                                        }
                                        return '#e5e5e5';
                                    },
                                },
                            }
                        }
                    }}
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                data: data,
                                label: "Nivel Rio do Sul (Atualizado à cada hora) - Fonte: Defesa Civil SC"
                            }
                        ]
                    }} />
            </div>
        </div>
    )
}
