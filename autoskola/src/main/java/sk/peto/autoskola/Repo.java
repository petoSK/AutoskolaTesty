package sk.peto.autoskola;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class Repo {
	Person pr = new Person();
	List<Person> list = new ArrayList<>();

	final private String host = "jdbc:mysql://localhost:3306/";
	final private String user = "root";
	final private String password = "root";
	private final String DBname = "astesty";
	Connection con = null;
		
	public Repo() {

		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			con = DriverManager.getConnection(host + DBname, user, password);
			System.out.println("connection to DB ...OK");
		} catch (Exception e) {
			System.out.println("connection to DB ...FAILED..." + e);
			e.printStackTrace();
		}

	}

	public List<Person> getList() {
		String query = "select * from testdb.employees";
		try {
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next()) {
				Person p = new Person();
				p.setId(rs.getInt(1));
				p.setName(rs.getString(2));
				p.setSurname(rs.getString(3));
				p.setCity(rs.getString(4));
				p.setSalary(rs.getInt(5));
				list.add(p);
			}

		} catch (SQLException e) {
			System.out.println(e);
			e.printStackTrace();
		}

		return list;
	}
}
