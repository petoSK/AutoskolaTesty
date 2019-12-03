package sk.peto.autoskola;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Blob;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Test {
private int otazka_id;
private String answer;
private String question;
private String optionA;
private String optionB;
private String optionC;

public int getOtazka_id() {
	return otazka_id;
}
public void setOtazka_id(int i) {
	this.otazka_id = i;
}
public String getQuestion() {
	return question;
}
public void setQuestion(String question) {
	this.question = question;
}
public String getOptionA() {
	return optionA;
}
public void setOptionA(String optionA) {
	this.optionA = optionA;
}
public String getOptionB() {
	return optionB;
}
public void setOptionB(String optionB) {
	this.optionB = optionB;
}
public String getOptionC() {
	return optionC;
}
public void setOptionC(String optionC) {
	this.optionC = optionC;
}
public String getAnswer() {
	return answer;
}
public void setAnswer(String answer) {
	this.answer = answer;
}

@Override
public String toString() {

	return question+"\n"+optionA+"\n"+optionB+"\n"+optionC+"\n answer: "+answer;
	
}


}
