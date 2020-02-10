package sk.peto.autoskola;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore.ProtectionParameter;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.imageio.stream.FileImageInputStream;


public class TestRepo {
	 private static final long serialVersionUID = 1L;
	Test nTest = new Test();
	TestResult tr=new TestResult();
	Otazka ot = new Otazka();
	User u = new User();
	ArrayList<Test> list = new ArrayList<>();
	ArrayList<Otazka> o= new ArrayList<>();
	ArrayList<User> userList = new ArrayList<>();
	String userN="";
	final private String host = "jdbc:mysql://localhost:3306/";
	final private String user = "root";
	final private String password = "root";
	private final String DBname = "autoskola";
	Connection con = null;

	public TestRepo() {

		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			con = DriverManager.getConnection(host + DBname, user, password);
			System.out.println("connection to DB ...OK");
		} catch (Exception e) {
			System.out.println("connection to DB ...FAILED..." + e);
			e.printStackTrace();
		}

	}

	public List<Test> getTesty() {

		String query = "select * from autoskola.testy";

		try {

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next()) {
				Test t = new Test();

				t.setOtazka_id(rs.getInt(1));
				t.setQuestion(rs.getString(2));
				t.setOptionA(rs.getString(3));
				t.setOptionB(rs.getString(4));
				t.setOptionC(rs.getString(5));
				t.setAnswer(rs.getString(6));
				list.add(t);
			}
		} catch (SQLException e) {
			System.out.println(e);
			e.printStackTrace();
		}
		return list;
	}

	public List<Test> getOtazka() {
		String query = "select otazka from autoskola.testy";
		try {
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			while (rs.next()) {
				Test t = new Test();
				t.setQuestion(rs.getString(1));

				list.add(t);
			}

		} catch (SQLException e) {
			System.out.println(e);
			e.printStackTrace();
		}
		return list;
	}

	public ArrayList<Test> getTestfromDb(int n) {
		// System.out.println(System.getProperty("user.dir"));
		System.out.println("Fetching test #" + n);
		int firstID = ((n - 1) * 27) + 1;
		int lastID = n * 27;

		System.out.println("id otazky medzi: " + firstID + " a " + lastID);
		String query = "select * from autoskola.testy where otazka_id>=" + firstID + " AND otazka_id<=" + lastID;
		try {

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next()) {
				Test t = new Test();

				t.setOtazka_id(rs.getInt(1));
				t.setQuestion(rs.getString(2));
				t.setOptionA(rs.getString(3));
				t.setOptionB(rs.getString(4));
				t.setOptionC(rs.getString(5));
				t.setAnswer(rs.getString(6));
				list.add(t);
			}
		} catch (SQLException e) {
			System.out.println(e);
			e.printStackTrace();
		}
		return list;
	}

	public List<User> getUser() {

		String query = "select * from autoskola.users";
		try {
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			while (rs.next()) {
				User u = new User();
				u.setId(rs.getInt(1));
				u.setUsername(rs.getString(2));
				u.setPassword(rs.getString(3));
				userList.add(u);
			}

		} catch (SQLException e) {
			System.out.println(e);
			e.printStackTrace();
		}
		return userList;

	}

	public Test createTest() { // nacita testy(otazky, moznosti, odpovede) z txt suboru, ulozi do DB

		String input = "C:\\Users\\Peter\\Desktop\\eclipse-workspace\\autoskola\\src\\main\\resources\\testyFinal.txt";

		String line = "";
		String str = "";
		String PatternQuestion1 = "\\d\\.";
		String PatternQuestion2 = "\\d\\d";
		String PatternOption = "\\w\\)";
		String answers = "";
		int qCount = 0;
		int a = 0;
		int b = 0;
		int c = 0;
		int answerCount = 0;
		try {

			String charset = "UTF-8";
			BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(input), charset));

			while ((line = br.readLine()) != null) {
				str = line.substring(0, 2);
				if (str.equals("te"))
					System.out.println(line);
				if (str.substring(0, 1).equals("@")) {
					answers = line.substring(1, line.length());
				}

				if (str.matches(PatternQuestion1) || str.matches(PatternQuestion2)) {
					// System.out.println(line);
					nTest.setQuestion(line);
				}

				if (str.matches(PatternOption)) {

					switch (str) {
					case "a)":
						nTest.setOptionA(line);
						a++; // System.out.println(line);
						break;
					case "b)":
						nTest.setOptionB(line);
						b++; // System.out.println(line);
						break;
					case "c)":
						nTest.setOptionC(line);
						c++; // System.out.println(line);
						if (answers.length() > 0) {
							qCount++;
							nTest.setAnswer(answers.substring(qCount - 1, qCount));
							// System.out.println(answers.length()+" Spravna odpoved("+qCount+"):
							// "+answers.substring(qCount-1, qCount));
							System.out.println(nTest.toString());
							copyToDb(nTest);
							answerCount++;
							if (qCount == 27)
								qCount = 0;
						}

						break;
					}
				}
			}

			System.out.println(a + "-" + b + "-" + c + " : " + answerCount);
			br.close();
		} catch (IOException e) {
			System.out.println(e);
			e.printStackTrace();
		}
		return nTest;
	}

	public void copyToDb(Test tst) { // dostaneme objekt "test"
		int sql_err_count = 0;
		String query = "INSERT INTO autoskola.testy(otazka,moznost_a,moznost_b,moznost_c,answer) VALUES(?,?,?,?,?)";

		try {
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, tst.getQuestion()); // ziskame jeho clenske premenne
			ps.setString(2, tst.getOptionA());
			ps.setString(3, tst.getOptionB());
			ps.setString(4, tst.getOptionC());
			ps.setString(5, tst.getAnswer());
			ps.executeUpdate();
		} catch (SQLException e) {
			sql_err_count++;
			System.out.println(e);
			System.out.println("sql errors count: " + sql_err_count);
			e.printStackTrace();
		}
	}
	
	
	
	public void saveResulttoDb(TestResult res) {
		int sql_err_count = 0;
		LocalDateTime currentTime = LocalDateTime.now();
		String dateToString=currentTime.getYear()+"-"+currentTime.getMonthValue()+"-"+currentTime.getDayOfMonth()+" "+
				currentTime.getHour()+":"+currentTime.getMinute()+":"+currentTime.getSecond(); 
		String query = "INSERT INTO autoskola.testresults(user,testn,points,passed,date) VALUES(?,?,?,?,?)";
		int boolToInt=0;
		if(res.getPassed())boolToInt=1;
		try {
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, res.getUser() ); // ziskame jeho clenske premenne
			ps.setInt(2, res.getTest());
			ps.setInt(3, res.getPoints());
			
			ps.setInt(4, boolToInt);
			ps.setString(5, dateToString);  //sql datetime format:  2020-01-01 10:10:10
			ps.executeUpdate();
		} catch (SQLException e) {
			sql_err_count++;
			System.out.println(e);
			System.out.println("sql errors count: " + sql_err_count);
			e.printStackTrace();
		}
		
	}
	
	
	
	
	public Otazka getOtazka( int i) {
		String query = "select * from autoskola.testy where otazka_id="+i; //otazka,moznost_a,moznost_b,moznost_c,answer
		Otazka ot = new Otazka();
		
		try {
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			while (rs.next()) {
				ot.setOtazka_id(rs.getInt(1));
				ot.setOtazka(rs.getString(2));
				ot.setMoznostA(rs.getString(3));
				ot.setMoznostB(rs.getString(4));
				ot.setMoznostC(rs.getString(5));
				ot.setOdpoved(rs.getString(6));
				o.add(ot);
			}

		} catch (SQLException e) {
			System.out.println(e);
			e.printStackTrace();
		}
	 System.out.println(ot.getOtazka());
	 System.out.println("\n"+ot.getOdpoved());
		return ot;
	
	}
}