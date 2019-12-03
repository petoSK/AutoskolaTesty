package sk.peto.autoskola;


import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Person {

	private int id;
	private String name;
	private String surname;
	private String city;
	private int salary;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public int getSalary() {
		return salary;
	}

	public void setSalary(int salary) {
		this.salary = salary;
	}

	
	
	@Override
	public String toString() {
		return "["+name+", "+surname+", "+city+", "+salary+", "+id+"]";
	}
	
	
	
	
	
}
