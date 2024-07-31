import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLOR } from '../../Constants'
import PdfBox from '../../Components/PdfBox'

const SubmitQuiz = ({ route, navigation }) => {
    const { score, total ,chapter, course , pdf} = route.params
    console.log(chapter, course)

    const percent = (score / total) * 100
    return (
        <View style={styles.fullbg}>
             <Text style={styles.t1}>{percent.toFixed(1)}%</Text>
            <Text style={styles.t2}>You Scored</Text>
            <Text style={styles.t3}>{score} / {total}</Text>
            {
                pdf && 
                <View  style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: '50%',
                }}>
                <PdfBox pdfUrl={pdf} />
            </View>
            }
            <Text style={styles.button}
                onPress={() => navigation.navigate('coursechapters', { chapter: chapter, course :course})}
            >Exit</Text>
        </View>
    )
}

export default SubmitQuiz

const styles = StyleSheet.create({
    fullbg: {
        flex: 1,
        backgroundColor: COLOR.col3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    t1: {
        fontSize: 100,
        fontWeight: 'bold',
        color: COLOR.col4
    },
    t2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLOR.col1
    },
    t3: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLOR.col1
    },
    button: {
        backgroundColor: COLOR.col1,
        padding: 10,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 20,
        color: COLOR.col3,
    }
})