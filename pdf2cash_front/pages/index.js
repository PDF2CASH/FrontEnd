import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Authenticate  from './auth';
import { Grid } from '@material-ui/core';
import { Line } from 'react-chartjs-2';

const styles = ({
    chart: {
        width: '100%',
        maxWidth: '100%',
    },
    grid: {
        overflowX: 'auto',
        overflowY: 'auto'
    },
});

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chart_data: {}
        };
    }

    async componentDidMount() {
        const url = 'http://localhost:8008/api/invoice/char_total_value_per_time/';
        const head = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + Authenticate.getToken()
            },
            credentials: 'omit',
        }
        const res = await fetch(url, head);
        const data = await res.json();
        const chart_data = await {
            labels: data.date,
            datasets: [
                {
                    label: 'Valor total/Tempo',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: data.total
                },
            ]
        }
        await this.setState({ chart_data });
    }

    render() {
        const classes = this.props;
        const { chart_data } = this.state;

        return (
            <Grid className={classes.grid}>
                <Line
                    data={chart_data}
                    height={'250px'}
                    classesName={classes.chart}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Index);
