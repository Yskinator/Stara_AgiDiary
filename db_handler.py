import os
import mysql.connector

def correct_mysql_connection():
    if os.environ["WHERE_AM_I"] == "Azure":
        return azure_mysql_connection()
    elif os.environ["WHERE_AM_I"] == "Local":
        return local_mysql_connection()
    else:
        raise Exception

def azure_mysql_connection():
    user = "agiadmin@agimysql"
    password = os.environ["AGILE_DB_PASSWORD"]
    host = "agimysql.mysql.database.azure.com"
    port = 3306
    database = "agidatabase"
    cnx = mysql.connector.connect(user = user, 
                                  password = password, 
                                  host = host, 
                                  port = port, 
                                  database = database)
    return cnx

def local_mysql_connection():
    user = "root"
    password = os.environ["AGILE_DB_PASSWORD_LOCAL"]
    host = "localhost"
    database = "agidatabase"
    cnx = mysql.connector.connect(user = user, 
                                  password = password, 
                                  host = host, 
                                  database = database)
    return cnx

def create_tables():
    print("Creating tables")
    project_query = """CREATE TABLE IF NOT EXISTS  projects (
                    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
                    project_id varchar(255),
                    address varchar(255),
                    project_url varchar(255)
                 );
              """
    
    user_query = """CREATE TABLE IF NOT EXISTS users (
                id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
                name varchar(255)
              );
           """

    post_query = """CREATE TABLE IF NOT EXISTS posts (
                id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
                project_id int,
                timestamp int,
                text varchar(1024),
                user_id int,
                FOREIGN KEY (project_id) REFERENCES projects(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
              );
           """


    link_query = """CREATE TABLE IF NOT EXISTS links (
                id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
                post_id int,
                url varchar(255),
                FOREIGN KEY (post_id) REFERENCES posts(id)
              );
           """

    images_query = """CREATE TABLE IF NOT EXISTS images (
                 id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
                 post_id int,
                 url varchar(255),
                 FOREIGN KEY (post_id) REFERENCES posts(id)
               );
            """
                          

    queries = [project_query, user_query, post_query, link_query, images_query]
    execute_queries(queries)

def clear_tables():
    print("Clearing tables")
    queries = []
    queries.append("DROP TABLE projects;")
    queries.append("DROP TABLE users;")
    queries.append("DROP TABLE posts;")
    queries.append("DROP TABLE links;")
    queries.append("DROP TABLE images;")
    execute_queries(queries[::-1])

def create_example_data():
    print("creating example data")
    queries = []
    queries.append('INSERT INTO projects (project_id, address, project_url) VALUES (123, "Junctionland", "random_string");')
    queries.append('INSERT INTO users (name) VALUES ("Pate");')
    queries.append('INSERT INTO posts (project_id, timestamp, text, user_id) VALUES (1, 12342314, "A very posty post.", 1);')
    queries.append('INSERT INTO links (post_id, url) VALUES (1, "link_link");')
    queries.append('INSERT INTO images (post_id, url) VALUES (1, "image_link");')
    execute_queries(queries)

def create_project(project_id, address, project_url):
    queries = []
    queries.append('INSERT INTO projects (project_id, address, project_url) VALUES ("{}", "{}", "{}");'.format(project_id, address, project_url))
    execute_queries(queries)

def create_post(links, images, project_id, text, timestamp, user_id):
    queries = []
    queries.append('INSERT INTO posts (project_id, timestamp, text, user_id) VALUES ({}, "{}", "{}", {});'.format(project_id, timestamp, text, user_id))
    execute_queries(queries)
    query = 'SELECT id FROM posts WHERE project_id={} AND timestamp={} AND text="{}" AND user_id={};'.format(project_id, timestamp, text, user_id)
    post_id = fetch_query(query)[0]["id"]
    queries = []
    for l in links:
        queries.append('INSERT INTO links (post_id, url) VALUES ({}, "{}");'.format(post_id, l))
    for i in images:
        queries.append('INSERT INTO images (post_id, url) VALUES ({}, "{}");'.format(post_id, i))
    execute_queries(queries)

def fetch_project(project_url):
    #Fetch project
    project_query = 'SELECT * FROM projects WHERE project_url="{}" LIMIT 1;'.format(project_url)
    project = fetch_query(project_query)[0]

    #Fetch posts
    posts_query = 'SELECT * FROM posts WHERE project_id="{}";'.format(project["id"])
    posts = fetch_query(posts_query)
    posts2 = []
    for p in posts:
        #Fetch links
        links_query = 'SELECT * FROM links WHERE post_id="{}";'.format(p["id"])
        links = fetch_query(links_query)
        p["links"] = links

        # Fetch images
        images_query = 'SELECT * FROM images WHERE post_id="{}";'.format(p["id"])
        images = fetch_query(images_query)
        p["images"] = images
        posts2.append(p)
    project["posts"] = posts2
    return project

def create_user(name):
    queries = ['INSERT INTO users (name) VALUES ("{}");'.format(name)]
    execute_queries(queries)

def find_project_url(project_id):
    query = 'SELECT project_url FROM projects WHERE project_id="{}";'.format(project_id)
    url = fetch_query(query)
    url = url[0]["project_url"]
    return url

def fetch_query(query):
    cnx = correct_mysql_connection()
    c = cnx.cursor()
    c.execute(query)
    columns = c.column_names
    results = []
    for r in c.fetchall():
        r = dict(zip(columns, r))
        results.append(r)
    return results


def execute_queries(queries):
    cnx = correct_mysql_connection()
    c = cnx.cursor()
    for q in queries:
        #c.execute(q)
        try:
            c.execute(q)
        except Exception:
            print("Exception with query: " + q)
    c.close()
    cnx.commit()
    cnx.close()

if __name__=="__main__":
    clear_tables()
    create_tables()
    create_example_data()
