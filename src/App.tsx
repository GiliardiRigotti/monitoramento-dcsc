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


function App() {
  const [estacoes, setEstacao] = useState<Estacao[]>([])
  const [itajai, setItajai] = useState<Data[]>([])
  const [labelsBrusque, setLabelsBrusque] = useState<string[]>([])
  const [dataBrusque, setDataBrusque] = useState<number[]>([])
  const [labelsBlumenau, setLabelsBlumenau] = useState<string[]>([])
  const [dataBlumenau, setDataBlumenau] = useState<number[]>([])
  const [isMobile, setIsMobile] = useState(false)

  const handleResize = () => {
    if (window.innerWidth < 800) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  }, [window])

  async function getApiBlumenau() {
    const listLabel: string[] = []
    const listData: number[] = []
    const response = await axios.get("https://api.itajai.sc.gov.br/enchente/rios-blumenau", {})
    response.data.niveis.forEach((item: { nivel: number, horaLeitura: string }) => {
      const date = `${new Date(item.horaLeitura).getDate() < 10 ? '0' + new Date(item.horaLeitura).getDate() : new Date(item.horaLeitura).getDate()}/${new Date(item.horaLeitura).getMonth() < 10 ? '0' + new Date(item.horaLeitura).getMonth() : new Date(item.horaLeitura).getMonth()} - ${new Date(item.horaLeitura).getHours() < 10 ? '0' + new Date(item.horaLeitura).getHours() : new Date(item.horaLeitura).getHours()}:${new Date(item.horaLeitura).getMinutes() < 10 ? '0' + new Date(item.horaLeitura).getMinutes() : new Date(item.horaLeitura).getMinutes()}`
      listLabel.push(date)
      listData.push(item.nivel)
    })
    setLabelsBlumenau(listLabel)
    setDataBlumenau(listData)
  }

  async function getApiItajaiDC02() {
    const listLabel: string[] = []
    const listData: number[] = []
    const response = await axios.get("https://intranet2.itajai.sc.gov.br/defesa-civil/api/telemetria?dc=DC02", {})
    response.data.forEach((item: { rio: number, datahora: string }) => {
      const date = `${new Date(item.datahora).getDate() < 10 ? '0' + new Date(item.datahora).getDate() : new Date(item.datahora).getDate()}/${new Date(item.datahora).getMonth() < 10 ? '0' + new Date(item.datahora).getMonth() : new Date(item.datahora).getMonth()} - ${new Date(item.datahora).getHours() < 10 ? '0' + new Date(item.datahora).getHours() : new Date(item.datahora).getHours()}:${new Date(item.datahora).getMinutes() < 10 ? '0' + new Date(item.datahora).getMinutes() : new Date(item.datahora).getMinutes()}`
      listLabel.push(date)
      listData.push(item.rio)
    })
    const data: Data = {
      local: 'ItajaiDC02',
      labels: listLabel,
      data: listData
    }

    return data
  }

  async function getApiItajaiDC07() {
    const listLabel: string[] = []
    const listData: number[] = []
    const response = await axios.get("https://intranet2.itajai.sc.gov.br/defesa-civil/api/telemetria?dc=DC07", {})
    response.data.forEach((item: { rio: number, datahora: string }) => {
      const date = `${new Date(item.datahora).getDate() < 10 ? '0' + new Date(item.datahora).getDate() : new Date(item.datahora).getDate()}/${new Date(item.datahora).getMonth() < 10 ? '0' + new Date(item.datahora).getMonth() : new Date(item.datahora).getMonth()} - ${new Date(item.datahora).getHours() < 10 ? '0' + new Date(item.datahora).getHours() : new Date(item.datahora).getHours()}:${new Date(item.datahora).getMinutes() < 10 ? '0' + new Date(item.datahora).getMinutes() : new Date(item.datahora).getMinutes()}`
      listLabel.push(date)
      listData.push(item.rio)
    })
    const data: Data = {
      local: 'ItajaiDC07',
      labels: listLabel,
      data: listData
    }

    return data
  }

  async function getApiItajaiDC03() {
    const listLabel: string[] = []
    const listData: number[] = []
    const response = await axios.get("https://intranet2.itajai.sc.gov.br/defesa-civil/api/telemetria?dc=DC03", {})
    response.data.forEach((item: { rio: number, datahora: string }) => {
      const date = `${new Date(item.datahora).getDate() < 10 ? '0' + new Date(item.datahora).getDate() : new Date(item.datahora).getDate()}/${new Date(item.datahora).getMonth() < 10 ? '0' + new Date(item.datahora).getMonth() : new Date(item.datahora).getMonth()} - ${new Date(item.datahora).getHours() < 10 ? '0' + new Date(item.datahora).getHours() : new Date(item.datahora).getHours()}:${new Date(item.datahora).getMinutes() < 10 ? '0' + new Date(item.datahora).getMinutes() : new Date(item.datahora).getMinutes()}`
      listLabel.push(date)
      listData.push(item.rio)
    })
    const data: Data = {
      local: 'ItajaiDC03',
      labels: listLabel,
      data: listData
    }

    return data
  }

  async function getApiItajaiDC04() {
    const listLabel: string[] = []
    const listData: number[] = []
    const response = await axios.get("https://intranet2.itajai.sc.gov.br/defesa-civil/api/telemetria?dc=DC04", {})
    response.data.forEach((item: { rio: number, datahora: string }) => {
      const date = `${new Date(item.datahora).getDate() < 10 ? '0' + new Date(item.datahora).getDate() : new Date(item.datahora).getDate()}/${new Date(item.datahora).getMonth() < 10 ? '0' + new Date(item.datahora).getMonth() : new Date(item.datahora).getMonth()} - ${new Date(item.datahora).getHours() < 10 ? '0' + new Date(item.datahora).getHours() : new Date(item.datahora).getHours()}:${new Date(item.datahora).getMinutes() < 10 ? '0' + new Date(item.datahora).getMinutes() : new Date(item.datahora).getMinutes()}`
      listLabel.push(date)
      listData.push(item.rio)
    })
    const data: Data = {
      local: 'ItajaiDC04',
      labels: listLabel,
      data: listData
    }

    return data
  }

  async function getApiItajaiDC06() {
    const listLabel: string[] = []
    const listData: number[] = []
    const response = await axios.get("https://intranet2.itajai.sc.gov.br/defesa-civil/api/telemetria?dc=DC06", {})
    response.data.forEach((item: { rio: number, datahora: string }) => {
      const date = `${new Date(item.datahora).getDate() < 10 ? '0' + new Date(item.datahora).getDate() : new Date(item.datahora).getDate()}/${new Date(item.datahora).getMonth() < 10 ? '0' + new Date(item.datahora).getMonth() : new Date(item.datahora).getMonth()} - ${new Date(item.datahora).getHours() < 10 ? '0' + new Date(item.datahora).getHours() : new Date(item.datahora).getHours()}:${new Date(item.datahora).getMinutes() < 10 ? '0' + new Date(item.datahora).getMinutes() : new Date(item.datahora).getMinutes()}`
      listLabel.push(date)
      listData.push(item.rio)
    })
    const data: Data = {
      local: 'ItajaiDC06',
      labels: listLabel,
      data: listData
    }

    return data
  }


  async function getApiItajai() {
    const dc02 = await getApiItajaiDC02()
    const dc03 = await getApiItajaiDC03()
    const dc04 = await getApiItajaiDC04()
    const dc06 = await getApiItajaiDC06()

    setItajai([dc02, dc03, dc04, dc06])
  }

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
    getApiBlumenau()
    getApiItajai()
    if (estacoes.length > 0) {
      const listLabel: string[] = []
      const listData: number[] = []
      const brusqueData = estacoes.filter((item) => item.nome == "DCSC Brusque")
      brusqueData[0].nivel_rio_historico?.forEach((item) => {
        const date = `${new Date(item.t_stamp).getDate() < 10 ? '0' + new Date(item.t_stamp).getDate() : new Date(item.t_stamp).getDate()}/${new Date(item.t_stamp).getMonth() < 10 ? '0' + new Date(item.t_stamp).getMonth() : new Date(item.t_stamp).getMonth()} - ${new Date(item.t_stamp).getHours() < 10 ? '0' + new Date(item.t_stamp).getHours() : new Date(item.t_stamp).getHours()}:${new Date(item.t_stamp).getMinutes() < 10 ? '0' + new Date(item.t_stamp).getMinutes() : new Date(item.t_stamp).getMinutes()}`
        console.log(date)
        listLabel.push(date)
        listData.push(item.nivel)
      })
      setLabelsBrusque(listLabel)
      setDataBrusque(listData)
    }
  }, [estacoes])

  if (true) {
    return (
      <div className='App'>
        <Line
          options={{
            scales: {
              y: {
                min: 1,
                max: 10,
                border: {
                  display: false
                },
                grid: {
                  color: function (context) {
                    if (context.tick.value == 8.0) {
                      return 'red';
                    }
                    if (context.tick.value == 6.0) {
                      return 'blue';
                    }
                    if (context.tick.value == 3.0) {
                      return 'orange';
                    }
                    if (context.tick.value == 2.5) {
                      return 'green';
                    }
                    if (context.tick.value == 2.0) {
                      return 'purple';
                    }
                    if (context.tick.value == 2.0) {
                      return 'yellow';
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
                backgroundColor: "blue",
                data: dataBrusque,
                label: "Nivel Brusque (Atualizado à cada hora)"
              },
              {
                backgroundColor: "red",
                data: dataBlumenau,
                label: "Nivel Blumenau (Atualizado à cada hora)"
              },
              {
                backgroundColor: "green",
                data: itajai[0].data,
                label: "Nivel Blumenau (Atualizado à cada hora)"
              },
              {
                backgroundColor: "orange",
                data: itajai[1].data,
                label: "Nivel Blumenau (Atualizado à cada hora)"
              },
              {
                backgroundColor: "purple",
                data: itajai[2].data,
                label: "Nivel Blumenau (Atualizado à cada hora)"
              },
              {
                backgroundColor: "yellow",
                data: itajai[3].data,
                label: "Nivel Blumenau (Atualizado à cada hora)"
              },
            ]
          }} />
      </div>
    )
  }

  if (false) {
    return (
      <div className="App">

        <Line
          options={{
            scales: {
              y: {
                min: 0,
                max: 10,
                border: {
                  display: false
                },
                grid: {
                  color: function (context) {
                    if (context.tick.value == 6.0) {
                      return 'red';
                    }
                    return '#e5e5e5';
                  },
                },
              }
            }
          }}
          data={{
            labels: labelsBrusque,
            datasets: [
              {
                data: dataBrusque,
                label: "Nivel Brusque (Atualizado à cada hora) - Fonte: Defesa Civil SC"
              }
            ]
          }} />

        <Line
          options={{
            scales: {
              y: {
                min: 0,
                max: 10,
                border: {
                  display: false
                },
                grid: {
                  color: function (context) {
                    if (context.tick.value == 8.0) {
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

        {
          itajai.length > 0 &&
          <>

            <Line
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 5,
                    border: {
                      display: false
                    },
                    grid: {
                      color: function (context) {
                        if (context.tick.value == 3.5) {
                          return 'red';
                        }
                        return '#e5e5e5';
                      },
                    },
                  }
                }
              }}
              data={{
                labels: itajai[0].labels,
                datasets: [
                  {
                    data: itajai[0].data,
                    label: "Nivel Rio Itajaí-Açu - Itajaí (Praça Celso Pereira da Silva) (Atualizado à cada 10 minutos )"
                  },
                ],
              }} />

            <Line
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 5,
                    border: {
                      display: false
                    },
                    grid: {
                      color: function (context) {
                        if (context.tick.value == 2.5) {
                          return 'red';
                        }
                        return '#e5e5e5';
                      },
                    },
                  }
                }
              }}
              data={{
                labels: itajai[1].labels,
                datasets: [
                  {
                    data: itajai[1].data,
                    label: "Nivel Rio Itajaí-Mirim - Itajaí (Atualizado à cada 10 minutos ) - Fonte: Captação SEMASA"
                  },
                ],
              }} />
            <Line
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 5,
                    border: {
                      display: false
                    },
                    grid: {
                      color: function (context) {
                        if (context.tick.value == 2.5) {
                          return 'red';
                        }
                        return '#e5e5e5';
                      },
                    },
                  }
                }
              }}
              data={{
                labels: itajai[2].labels,
                datasets: [
                  {
                    data: itajai[2].data,
                    label: "Nivel Rio Itajaí-Mirim - Itajaí (Curso antigo - Propriedade Privada) (Atualizado à cada 10 minutos ) - Fonte: Defesa Civíl Itajaí"
                  },
                ],
              }} />
            <Line
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 10,
                    border: {
                      display: false
                    },
                    grid: {
                      color: function (context) {
                        if (context.tick.value == 1.25) {
                          return 'red';
                        }
                        return '#e5e5e5';
                      },
                    },
                  }
                }
              }}
              data={{
                labels: itajai[3].labels,
                datasets: [
                  {
                    data: itajai[3].data,
                    label: "Nivel Rio Itajaí-Mirim - Itajaí (Itamirim Clube de Campo) (Atualizado à cada 10 minutos )"
                  },
                ],
              }} />
            <Line
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 5,
                    border: {
                      display: false
                    },
                    grid: {
                      color: function (context) {
                        if (context.tick.value == 2.5) {
                          return 'red';
                        }
                        return '#e5e5e5';
                      },
                    },
                  }
                }
              }}
              data={{
                labels: itajai[3].labels,
                datasets: [
                  {
                    data: itajai[3].data,
                    label: "Nivel Ribeirão da Murta - Itajaí (Portal) (Atualizado à cada 10 minutos ) - Fonte: Defesa Civíl Itajaí"
                  },
                ],
              }} />
          </>
        }
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
        <div style={{ display: 'flex', width: '40%' }}>
          <Line
            options={{
              scales: {
                y: {
                  min: 0,
                  max: 10,
                  border: {
                    display: false
                  },
                  grid: {
                    color: function (context) {
                      if (context.tick.value == 6.0) {
                        return 'red';
                      }
                      return '#e5e5e5';
                    },
                  },
                }
              }
            }}
            data={{
              labels: labelsBrusque,
              datasets: [
                {
                  data: dataBrusque,
                  label: "Nivel Brusque (Atualizado à cada hora) - Fonte: Defesa Civil SC"
                }
              ]
            }} />
        </div>
        <div style={{ display: 'flex', width: '40%' }}>
          <Line
            options={{
              scales: {
                y: {
                  min: 0,
                  max: 10,
                  border: {
                    display: false
                  },
                  grid: {
                    color: function (context) {
                      if (context.tick.value == 8.0) {
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
      {
        itajai.length > 0 &&
        <>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
            <div style={{ display: 'flex', width: '40%' }}>
              <Line
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: 5,
                      border: {
                        display: false
                      },
                      grid: {
                        color: function (context) {
                          if (context.tick.value == 3.5) {
                            return 'red';
                          }
                          return '#e5e5e5';
                        },
                      },
                    }
                  }
                }}
                data={{
                  labels: itajai[0].labels,
                  datasets: [
                    {
                      data: itajai[0].data,
                      label: "Nivel Rio Itajaí-Açu - Itajaí (Praça Celso Pereira da Silva) (Atualizado à cada 10 minutos )"
                    },
                  ],
                }} />
            </div>
            <div style={{ display: 'flex', width: '40%' }}>
              <Line
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: 5,
                      border: {
                        display: false
                      },
                      grid: {
                        color: function (context) {
                          if (context.tick.value == 2.5) {
                            return 'red';
                          }
                          return '#e5e5e5';
                        },
                      },
                    }
                  }
                }}
                data={{
                  labels: itajai[1].labels,
                  datasets: [
                    {
                      data: itajai[1].data,
                      label: "Nivel Rio Itajaí-Mirim - Itajaí (Atualizado à cada 10 minutos ) - Fonte: Captação SEMASA"
                    },
                  ],
                }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
            <div style={{ display: 'flex', width: '40%' }}>
              <Line
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: 5,
                      border: {
                        display: false
                      },
                      grid: {
                        color: function (context) {
                          if (context.tick.value == 2.5) {
                            return 'red';
                          }
                          return '#e5e5e5';
                        },
                      },
                    }
                  }
                }}
                data={{
                  labels: itajai[2].labels,
                  datasets: [
                    {
                      data: itajai[2].data,
                      label: "Nivel Rio Itajaí-Mirim - Itajaí (Curso antigo - Propriedade Privada) (Atualizado à cada 10 minutos ) - Fonte: Defesa Civíl Itajaí"
                    },
                  ],
                }} />
            </div>
            <div style={{ display: 'flex', width: '40%' }}>
              <Line
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: 5,
                      border: {
                        display: false
                      },
                      grid: {
                        color: function (context) {
                          if (context.tick.value == 1.5) {
                            return 'red';
                          }
                          return '#e5e5e5';
                        },
                      },
                    }
                  }
                }}
                data={{
                  labels: itajai[3].labels,
                  datasets: [
                    {
                      data: itajai[3].data,
                      label: "Nivel Rio Itajaí-Mirim - Itajaí (Itamirim Clube de Campo) (Atualizado à cada 10 minutos )"
                    },
                  ],
                }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
            <div style={{ display: 'flex', width: '40%' }}>
              <Line
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: 5,
                      border: {
                        display: false
                      },
                      grid: {
                        color: function (context) {
                          if (context.tick.value == 2.5) {
                            return 'red';
                          }
                          return '#e5e5e5';
                        },
                      },
                    }
                  }
                }}
                data={{
                  labels: itajai[3].labels,
                  datasets: [
                    {
                      data: itajai[3].data,
                      label: "Nivel Ribeirão da Murta - Itajaí (Portal) (Atualizado à cada 10 minutos ) - Fonte: Defesa Civíl Itajaí"
                    },
                  ],
                }} />
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default App;
