from pymongo import MongoClient
import pandas as pd

def connectMongo(host, port, username, password, db):
  if username and password:
    mongo_url = "mongodb://%s:%s@%s:%s/%s" % (username, password, host, port, db)
    connection = MongoClient(mongo_url)
  else:
    connection = MongoClient(host, port)
  return connection[db]

def getMatrix(db):
  matrix = list()
  goods = list(db.goods.find())
  goodsTitle = list(['username'])
  for good in goods:
    goodsTitle.append(str(good['_id']))

  users = list(db.users.find())
  for user in users:
    userRow = list([user['username']])
    for i in range(len(goods)):
      userRow.append(goods[i]['sale'] * 0.3 + goods[i]['view'] * 0.1)
    for key in user['goods']:
      for i in range(len(goods)):
        if str(goods[i]['_id']) == str(key):
          userRow[i + 1] = user['goods'][key]['bought'] * 3 + user['goods'][key]['view'] * 0.5 + goods[i]['sale'] * 0.3 + goods[i]['view'] * 0.1
          break
    matrix.append(userRow)
  return (goodsTitle, matrix)

def getRecommand(header, matrix):
  data = pd.DataFrame(matrix)
  data.columns = header
  data.set_index('username', inplace = True)
  corrMatrix = data.corr(method = 'pearson')

  recommandResult = list()
  for row in matrix:
    username = row[0]
    myRatings = data.loc[username].dropna()
    simCandidates = pd.Series()
    for i in range(0, len(myRatings.index)):
      sims = corrMatrix[myRatings.index[i]].dropna()
      sims = sims.map( lambda x: x * myRatings[i])
      simCandidates = simCandidates.append(sims)
    simCandidates.sort_values(inplace = True, ascending = False)
    simCandidates = simCandidates.groupby(simCandidates.index).sum()
    simCandidates.sort_values(inplace = True, ascending = False)
    recommands = list()
    for i in range(0, len(simCandidates.index)):
      if i < 4:
        recommands.append(simCandidates.index[i])
      elif i < 10 and i * 3 <= len(simCandidates.index):
        recommands.append(simCandidates.index[i])
    result = {}
    result['username'] = username
    result['recommands'] = recommands
    recommandResult.append(result)
  return recommandResult

def updateRecommandToDB(db, recommandForEachUser):
  for recommand in recommandForEachUser:
    db.users.update_one({'username': recommand['username']}, {'$set': {'recommands': recommand['recommands']}})

def main():
  db = connectMongo('139.199.59.246', 27000, 'Kingsley', 'KingsleyChung132', 'BlockChain_Market')
  (header, matrix) = getMatrix(db)
  recommandForEachUser = getRecommand(header, matrix)
  updateRecommandToDB(db, recommandForEachUser)

while True:
  main()

# exec(open("Recommand.py",encoding='utf-8').read())
